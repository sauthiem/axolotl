import psycopg2
from flask import Flask
from flask_cors import CORS
import string
import datetime
from datetime import timedelta
import json
from json import JSONEncoder
from dateutil.relativedelta import relativedelta
import re

#/home/kasm-user/cathydb.sh
class Mesure:
  def __init__(self, nom, valeur, horodate):
    self.nom = nom
    self.valeur = valeur
    self.horodate = horodate

class PH:
  def __init__(self, art, vei, cap):
    self.art = art
    self.vei = vei
    self.cap = cap

class Patient:
  infos =[]
  ventilation = []
  pouls = []
  FC = []
  FiO2 = []
  MAwP = []
  SpO2 = []
  SpO2_valid = []
  PaO2 = []
  eOI = []
  ph = []
  vt = []
  bilan = []
  poids=[]
  
  def __init__(self, noadmsip, infos=[], ventilation=[], pouls=[], FC=[], FiO2=[], MAwP=[], SpO2_valid=[], PaO2=[], eOI=[], ph=[], vt=[], bilan=[], poids=[]):
    self.noadmsip = noadmsip
    self.infos = infos
    self.ventilation = ventilation
    self.pouls = pouls
    self.FC = FC
    self.FiO2 = FiO2
    self.MAwP = MAwP
    self.SpO2_valid = SpO2_valid
    self.PaO2 = PaO2
    self.eOI = eOI
    self.ph = ph
    self.vt = vt
    self.bilan = bilan
    self.poids = poids

class PHEncoder(JSONEncoder):
        def default(self, o):
            return o.__dict__

class PatientEncoder(JSONEncoder):
        def default(self, o):
            return o.__dict__

app = Flask(__name__)
file = open("/home/kasm-user/Desktop/Downloads/mot_de_passe", "r")
data = file.read() 
ids = data.split(";")
conn = None
cur = None

dateNow = datetime.datetime.now()
sevenDays = timedelta(days=7)
limitDate = dateNow - sevenDays
sixMonths = relativedelta(months=6)
try:
    conn = psycopg2.connect(
        host = 'localhost',
        dbname = 'cathydb',
        user = ids[0],
        password = ids[1].translate({ord(c): None for c in string.whitespace}),
        port = 5432
    )
    cur = conn.cursor()

    @app.route("/beds/<noadmsip>")
    def searchPatient(noadmsip):        
        print(noadmsip)
        patient = addToPatient(noadmsip)
        PatientEncoder().encode(patient)
        
        #Encode Patient Object into JSON formatted Data using custom JSONEncoder
        patientJSONData = json.dumps(patient, indent=4, cls=PatientEncoder)
        
        return(patientJSONData)

    # Beds API Route
    @app.route("/beds")
    def showBeds():
        cur.execute('SELECT lits.lit, d_encounter.encounterid, d_encounter.firstname, d_encounter.lastname FROM "readonly"."d_encounter" JOIN "readonly"."lits" ON d_encounter.encounterid = lits.noadmsip WHERE "lits"."sortie" IS NULL AND "lits"."lit" <> 0 AND "lits"."entree" > '+ "'" + str(dateNow-sixMonths) +"'" +' ORDER BY "lits"."lit" ASC;')
        listBeds = cur.fetchall()
        listBedsStr = []
        for i in listBeds:
            p = str(i).split("'")
            listBedsStr.append([p[1], p[2][3:-2], p[3],p[5]])
        PatientEncoder().encode(listBedsStr)
        JSONData = json.dumps(listBedsStr, indent=4, cls=PatientEncoder)
        return(JSONData)

    conn.commit()

except Exception as error:
    print(error)

def addToPatient(noadmsip):
    patient = Patient(noadmsip)
    patient.infos.clear()
    patient.ventilation.clear()
    patient.eOI.clear()
    patient.PaO2.clear()
    patient.bilan.clear()
    patient.FC.clear()
    patient.FiO2.clear()
    patient.MAwP.clear()
    patient.ph.clear()
    patient.pouls.clear()
    patient.SpO2_valid.clear()
    patient.vt.clear()
    patient.poids.clear()

    #Infos
    cur.execute('SELECT firstname, lastname, dateofbirth, gender, lifetimenumber FROM "readonly"."d_encounter" WHERE "encounterid"='+"'"+ str(noadmsip) +"'"+ ';')
    dataInfos = cur.fetchall()
    
    for x in dataInfos[0]:
        if(isinstance(x, datetime.datetime)):
            age = datetime.date(1, 1, 1) + (dateNow - x)
            patient.infos.append([str(age.year - 1),str(age.month- 1),str(age.day - 1)])
        else:
            patient.infos.append(str(x))
    patient.infos.append(noadmsip)

    #POIDS
    cur.execute('SELECT valuenumber, charttime FROM "readonly"."ptdemographic" WHERE "encounterid"='+"'"+ str(noadmsip) +"'"+ 'AND "attributeid" IN(90292, 90305, 101957, 46228) AND "attributeid" IS NOT NULL AND "valuenumber"> 1 ORDER BY "utccharttime" DESC ;')
    poids = cur.fetchall()
    for p in poids:
        patient.poids.append(Mesure('Poids', str(p[0]), str(p[1])))
    if(poids[0][0]):
        patient.infos.append(round(float(poids[0][0]),1)) 
    else:
        patient.infos.append('None')
    
    #POIDS IDEAL
    cur.execute('SELECT valuenumber FROM "readonly"."ptdemographic" WHERE "encounterid"='+"'"+ str(noadmsip) +"'"+ 'AND "attributeid" = 14650 AND "valuenumber" IS NOT NULL AND "valuenumber"> 1 ORDER BY "utccharttime" DESC ;')
    poidsId = cur.fetchone()
    if(poidsId):
        pId = str(poidsId).split("'")
        patient.infos.append(round(float(pId[1]),1)) 
    else:
        patient.infos.append('None')
    #TAILLE
    cur.execute('SELECT valuenumber FROM "readonly"."ptassessment" WHERE "encounterid"='+"'"+ str(noadmsip) +"'"+ 'AND "attributeid" = 95793  AND "attributeid" IS NOT NULL AND "valuenumber"> 0 ORDER BY "utccharttime" DESC ;')
    taille = cur.fetchone()
    if(taille):
        p = str(taille).split("'")
        patient.infos.append(round(float(p[1]),1)) 
    else:
        patient.infos.append('None')
    
    print(patient.infos)

    cur.execute('SELECT par, valnum, horodate FROM "readonly"."icca_htr" WHERE "noadmsip"='+ str(noadmsip) + ' AND "par" IN('+ "'Pouls (SpO2)','SpO2', 'FC', 'Inspired O2 (FiO2) Setting', 'Mean Airway Pressure', 'Positive End Expiratory Pressure (PEEP)', 'Tidal Volume Indexed By Body Weight', 'Ventilation Mode'" + ') AND "horodate" >' +"'" + str(limitDate) +"'" +' ORDER BY "horodate" DESC;')
    dataICCA = cur.fetchall()
    
    for i in dataICCA:
        if(str(i[0])=='Ventilation Mode'): #Ventilation
            if(str(i[1])== '12' or str(i[1])== '13' or str(i[1])== '14'or str(i[1])== '17'):
                patient.ventilation.append(Mesure("Ventilation", str(False), str(i[2])))
            else:
                patient.ventilation.append(Mesure("Ventilation", str(True), str(i[2])))
        if(str(i[0])=='Pouls (SpO2)'): #Pouls
            patient.pouls.append(Mesure("Pouls", str(i[1]), str(i[2])))
        if(str(i[0])=='Mean Airway Pressure'): #MAwP
            patient.MAwP.append(Mesure("MAwP", str(i[1]), str(i[2])))
        if(str(i[0])=='Positive End Expiratory Pressure (PEEP)'): #PEEP
            patient.MAwP.append(Mesure("PEEP", str(i[1]), str(i[2])))
        if(str(i[0])=='SpO2'): #SPO2
            patient.SpO2_valid.append(Mesure("SpO2_valid", str(i[1]), str(i[2])))
        if(str(i[0])=='Inspired O2 (FiO2) Setting'): #FIO
            patient.FiO2.append(Mesure("FiO2", str(i[1]), str(i[2])))
        if(str(i[0])=='FC'): #FC
            patient.FC.append(Mesure("FC", str(i[1]), str(i[2])))
        if(str(i[0])=='Tidal Volume Indexed By Body Weight'): #Vt
            patient.vt.append(Mesure("Vt", str(i[1]), str(i[2])))
    
    cur.execute('SELECT ph, po2, horodate, site FROM "readonly"."blood_gas" WHERE "noadmsip"='+ str(noadmsip) + ' AND "horodate" >' +"'" + str(limitDate) +"'" +' ORDER BY "horodate" DESC;')
    dataBlood = cur.fetchall()
    for j in dataBlood:
        if(str(j[3]) =='ARTERIEL'):
            patient.ph.append(Mesure("pH_ART", str(j[0]), str(j[2])))
            patient.PaO2.append(Mesure("PaO2", str(j[1]), str(j[2])))
        elif(str(j[3]) =='VEINEUX'):
            patient.ph.append(Mesure("pH_VEI", str(j[0]), str(j[2])))
            patient.PaO2.append(Mesure("PaO2", str(j[1]), str(j[2])))
        elif(str(j[3]) =='CAPILLAIRE'):
            patient.ph.append(Mesure("pH_CAP", str(j[0]), str(j[2])))
            patient.PaO2.append(Mesure("PaO2", str(j[1]), str(j[2])))

    return patient


"""if cur is not None:
    cur.close()
if conn is not None:
    conn.close()
     """
cors = CORS(app, resource={
    r"/*":{
        "origins":"*"
    }
})
if __name__=="__main__":
    app.run(port=3587, debug=True)