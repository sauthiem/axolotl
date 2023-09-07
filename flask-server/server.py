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
import sqlite3
import os

DB_path = '../Patients.db'

#/home/kasm-user/cathydb.sh
connection = sqlite3.connect(DB_path, check_same_thread=False)

cursor = connection.cursor()

#create patinent info table

cursor.execute("""CREATE TABLE IF NOT EXISTS
Patients(noadmsip INTEGER PRIMARY KEY, fistname TEXT, lastname TEXT, age TEXT, gender TEXT, lifetimenb INT, weight FLOAT, idealWeight FLOAT, height FLOAT, lastLoadingTime DATETIME)""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_patients_noadmsip ON Patients (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_patients_lastLoadingTime ON Patients (lastLoadingTime)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
Ventilation(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, value INTEGER, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_vent_noadmsip ON Ventilation (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_vent_horodate ON Ventilation (horodate)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
Pouls(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, value FLOAT, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_pouls_noadmsip ON Pouls (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_pouls_horodate ON Pouls (horodate)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
FC(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, value FLOAT, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_fc_noadmsip ON FC (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_fc_horodate ON FC (horodate)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
FiO2(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, value FLOAT, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_fio2_noadmsip ON FiO2 (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_fio2_horodate ON FiO2 (horodate)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
Pressions(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, nom TEXT, value FLOAT, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_pre_noadmsip ON Pressions (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_pre_horodate ON Pressions (horodate)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
SpO2(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, value FLOAT, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_spo2_noadmsip ON SpO2 (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_spo2_horodate ON SpO2 (horodate)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
PaO2(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, realV INTEGER, value FLOAT, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_paO2_noadmsip ON PaO2 (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_paO2_horodate ON PaO2 (horodate)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
ePaO2(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, realV INTEGER, value FLOAT, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_epao2_noadmsip ON ePaO2 (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_epao2_horodate ON ePaO2 (horodate)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
OI(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, realV INTEGER, value FLOAT, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_oi_noadmsip ON OI (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_oi_horodate ON OI (horodate)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
eOI(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, realV INTEGER, value FLOAT, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_eoi_noadmsip ON eOI (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_eoi_horodate ON eOI (horodate)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
pH(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, source TEXT, value FLOAT, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_ph_noadmsip ON pH (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_ph_horodate ON pH (horodate)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
Vt(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, value FLOAT, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_vt_noadmsip ON Vt (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_vt_horodate ON Vt (horodate)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
Bilan(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, type TEXT, value FLOAT, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_bilan_noadmsip ON Bilan (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_bilan_horodate ON Bilan (horodate)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
Hypoxemie(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, severe INTEGER, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_hyp_noadmsip ON Hypoxemie (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_hyp_horodate ON Hypoxemie (horodate)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS
Poids(mesure_id INTEGER PRIMARY KEY AUTOINCREMENT, noadmsip INTEGER, value FLOAT, horodate DATETIME, FOREIGN KEY(noadmsip) REFERENCES Patients(noadmsip))""")

cursor.execute("""CREATE INDEX IF NOT EXISTS idx_poids_noadmsip ON Poids (noadmsip)""")
cursor.execute("""CREATE INDEX IF NOT EXISTS idx_poids_horodate ON Poids (horodate)""")

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
sixMonths = relativedelta(months=6)
thirtySeconds = timedelta(seconds=30)
try:
    conn = psycopg2.connect(
        host = 'localhost',
        dbname = 'cathydb',
        user = ids[0],
        password = ids[1].translate({ord(c): None for c in string.whitespace}),
        port = 5432
    )
    cur = conn.cursor()

    # Beds API Route
    @app.route("/beds")
    def showBeds():
        cur.execute('BEGIN;')
        cur.execute('SELECT lits.lit, d_encounter.encounterid, d_encounter.firstname, d_encounter.lastname FROM "readonly"."d_encounter" JOIN "readonly"."lits" ON d_encounter.encounterid = lits.noadmsip WHERE "lits"."sortie" IS NULL AND "lits"."lit" <> 0 AND "lits"."entree" > '+ "'" + str(dateNow-sixMonths) +"'" +' ORDER BY "lits"."lit" ASC;')
        listBeds = cur.fetchall()
        cur.execute("ROLLBACK;")
        listBedsStr = []
        for i in listBeds:
            p = str(i).split("'")
            listBedsStr.append([p[1], p[2][3:-2], p[3],p[5]])
        PatientEncoder().encode(listBedsStr)
        JSONData = json.dumps(listBedsStr, indent=4, cls=PatientEncoder)
        return(JSONData)

    @app.route("/beds/<noadmsip>")
    def searchPatient(noadmsip):   
        patient = addToPatient(noadmsip)
        PatientEncoder().encode(patient)
        patientJSONData = json.dumps(patient, indent=4, cls=PatientEncoder)
        return(patientJSONData)
    
    @app.route("/pages/<mesure>/<noadmsip>/<fenetre>")
    def searchMesure(mesure, noadmsip, fenetre):  
        target_datetime = datetime.datetime.fromtimestamp(int(fenetre)/1000)
        cursor.execute("SELECT * FROM " + mesure +" WHERE noadmsip="+ noadmsip +" AND horodate > '" + str(target_datetime)[:19] +"' ORDER BY horodate DESC")     
        allValues = cursor.fetchall()
        PatientEncoder().encode(allValues)
        allValuesJSONData = json.dumps(allValues, indent=4, cls=PatientEncoder)
        return(allValuesJSONData)
    
    @app.route("/DBsize")
    def searchSize():  
        file_name = DB_path
        file_stats = os.stat(file_name)
        size = file_stats.st_size / (1024 * 1024)
        PatientEncoder().encode(size)
        sizeJSONData = json.dumps(size, indent=4, cls=PatientEncoder)
        return(sizeJSONData)
    
    @app.route("/DeleteDB")
    def deleteDB():
        cursor.execute("BEGIN;")
        cursor.execute("DROP TABLE IF EXISTS Patients;")
        cursor.execute("DROP TABLE IF EXISTS Ventilation;")
        cursor.execute("DROP TABLE IF EXISTS FC;")
        cursor.execute("DROP TABLE IF EXISTS Pressions;")
        cursor.execute("DROP TABLE IF EXISTS Pouls;")
        cursor.execute("DROP TABLE IF EXISTS SpO2;")
        cursor.execute("DROP TABLE IF EXISTS Vt;")
        cursor.execute("DROP TABLE IF EXISTS PaO2;")
        cursor.execute("DROP TABLE IF EXISTS pH;")
        cursor.execute("DROP TABLE IF EXISTS ePaO2;")
        cursor.execute("DROP TABLE IF EXISTS eOI;")
        cursor.execute("DROP TABLE IF EXISTS OI;")
        cursor.execute("DROP TABLE IF EXISTS FiO2;")
        cursor.execute("DROP TABLE IF EXISTS Bilan;")
        cursor.execute("DROP TABLE IF EXISTS Poids;")
        cursor.execute("DROP TABLE IF EXISTS Hypoxemie;")
        cursor.execute("COMMIT;")
        searchSize()
        return('Patients.db empty')
    
    @app.route("/DeleteDischargedPatients")
    def deletePO():
        """cursor.execute("")"""
        return('Done')

except Exception as error:
    print(error)

def addToPatient(noadmsip):
        print(str(noadmsip))
        cursor.execute('SELECT noadmsip FROM Patients;')  
        allPatients = cursor.fetchall()
        print(allPatients)
        #Check if the patient already exists in the db
        cursor.execute('SELECT lastLoadingTime FROM Patients WHERE noadmsip ='+ noadmsip +';')  
        lastLoadingTime = cursor.fetchone()
        if lastLoadingTime is not None:
            print('not none')
            limitDate = datetime.datetime.strptime(lastLoadingTime[0], '%Y-%m-%d %H:%M:%S')
            print(limitDate)
            cursor.execute("BEGIN;")
            cursor.execute("UPDATE Patients SET lastLoadingTime = datetime('"+ str(dateNow) +"') WHERE noadmsip ="+ noadmsip +";")
            cursor.execute("COMMIT;")
        else:
            print('none')
            limitDate = dateNow - sevenDays
            print(limitDate)
            #Infos
            cur.execute('SELECT firstname, lastname, dateofbirth, gender, lifetimenumber FROM "readonly"."d_encounter" WHERE "encounterid"='+"'"+ str(noadmsip) +"'"+ ';')
            dataInfos = cur.fetchall()
            #POIDS
            cur.execute('SELECT valuenumber,charttime FROM "readonly"."ptdemographic" WHERE "encounterid"='+"'"+ str(noadmsip) +"'"+ 'AND "attributeid" IN(90292, 90305, 101957, 46228) AND "valuenumber" IS NOT NULL AND "valuenumber"> 1 ORDER BY "charttime" DESC ;')
            poids = cur.fetchall()
            cursor.execute("BEGIN;")#begin transaction
            for p in poids:
                cursor.execute("INSERT INTO Poids(noadmsip, value, horodate) VALUES("+ str(noadmsip)+","+str(p[0])+", datetime('"+ str(p[1])[:19]+"'))")
            cursor.execute("COMMIT;")#end transaction
            if(poids[0][0]):
                weight = round(float(poids[0][0]),1) 
            else:
                weight ='None'
            #POIDS IDEAL
            cur.execute('SELECT valuenumber FROM "readonly"."ptdemographic" WHERE "encounterid"='+"'"+ str(noadmsip) +"'"+ 'AND "attributeid" = 14650 AND "valuenumber" IS NOT NULL AND "valuenumber"> 1 ORDER BY "charttime" DESC ;')
            poidsId = cur.fetchone()
            if(poidsId):
                pId = str(poidsId).split("'")
                weightId = round(float(pId[1]),1) 
            else:
                weightId ='None'
            #TAILLE
            cur.execute('SELECT valuenumber FROM "readonly"."ptassessment" WHERE "encounterid"='+"'"+ str(noadmsip) +"'"+ 'AND "attributeid" = 95793  AND "attributeid" IS NOT NULL AND "valuenumber"> 0 ORDER BY "charttime" DESC ;')
            taille = cur.fetchone()
            if(taille):
                p = str(taille).split("'")
                height = round(float(p[1]),1) 
            else:
                height = 'None'
            cursor.execute("BEGIN;")#begin transaction
            cursor.execute("INSERT INTO Patients VALUES ('"+ str(noadmsip) + "','" + str(dataInfos[0][0]) + "','" + str(dataInfos[0][1]) + "',datetime('"+ str(dataInfos[0][2]) +"'),'"+ str(dataInfos[0][3])+ "','" +str(dataInfos[0][4])+ "','"+ str(weight) + "','"+ str(weightId) +"','"+ str(height) + "', datetime('now','localtime'))")
            cursor.execute("COMMIT;")#end transaction

        #On rentre les dernières données   
        cur.execute('SELECT par, valnum, horodate FROM "readonly"."icca_htr" WHERE "noadmsip"='+ str(noadmsip) + ' AND "par" IN('+ "'Pouls (SpO2)','SpO2', 'FC', 'Inspired O2 (FiO2) Setting', 'Mean Airway Pressure', 'Positive End Expiratory Pressure (PEEP)', 'Tidal Volume Indexed By Body Weight', 'Ventilation Mode'" + ') AND "horodate" >' +"'" + str(limitDate) +"'" +' ORDER BY "horodate" DESC;')
        print('icca selected')
        dataICCA = cur.fetchall()

        cursor.execute("BEGIN;")#begin transaction
        for i in dataICCA:
            if(i[1] is not None):
                if(str(i[0])=='Ventilation Mode'): #Ventilation
                    try:
                        if(str(i[1])== '12' or str(i[1])== '13' or str(i[1])== '14'or str(i[1])== '17'):
                            cursor.execute("INSERT INTO Ventilation (noadmsip, value, horodate) VALUES("+ str(noadmsip) + ",0,datetime('" + str(i[2])[:19]+"'))")
                        else:
                            cursor.execute("INSERT INTO Ventilation (noadmsip, value, horodate) VALUES("+ str(noadmsip) + ",1,datetime('" + str(i[2])[:19]+"'))")
                    except:
                        print('Ventilation:'+ str(i))
                if(str(i[0])=='Pouls (SpO2)'): #Pouls
                    try:
                        cursor.execute("INSERT INTO Pouls (noadmsip, value, horodate) VALUES("+ str(noadmsip) + "," + str(i[1]) + ",datetime('" + str(i[2])[:19]+"'))")
                    except:
                        print('Pouls:'+ str(i))
                if(str(i[0])=='Mean Airway Pressure'): #MAwP
                    try:
                        cursor.execute("INSERT INTO Pressions (noadmsip, nom, value, horodate) VALUES("+ str(noadmsip) + ", 'MAwP'," + str(i[1]) + ",datetime('" + str(i[2])[:19]+"'))")
                    except:
                        print('MAwP:'+ str(i))
                if(str(i[0])=='Positive End Expiratory Pressure (PEEP)'): #PEEP
                    try:
                        cursor.execute("INSERT INTO Pressions (noadmsip, nom, value, horodate) VALUES("+ str(noadmsip) + ", 'PEEP'," + str(i[1]) + ",datetime('" + str(i[2])[:19]+"'))")
                    except:
                        print('PEEP:'+ str(i))
                if(str(i[0])=='SpO2'): #SPO2
                    try:
                        cursor.execute("INSERT INTO SpO2 (noadmsip, value, horodate) VALUES("+ str(noadmsip) + "," + str(i[1]) + ", datetime('" + str(i[2])[:19]+"'))")
                    except:
                        print('SpO2:'+ str(i))
                if(str(i[0])=='Inspired O2 (FiO2) Setting'): #FIO
                    if i[1]<1:
                        f=i[1]*100
                        print(i[1])
                    else:
                        f=i[1]
                    try:
                        cursor.execute("INSERT INTO FiO2 (noadmsip, value, horodate) VALUES("+ str(noadmsip) + "," + str(f) + ",datetime('" + str(i[2])[:19]+"'))")
                    except:
                        print('FiO2:'+ str(i))
                if(str(i[0])=='FC'): #FC
                    try:
                        cursor.execute("INSERT INTO FC (noadmsip, value, horodate) VALUES("+ str(noadmsip) + "," + str(i[1]) + ",datetime('" + str(i[2])[:19]+"'))")
                    except:
                        print('FC:'+ str(i))
                if(str(i[0])=='Tidal Volume Indexed By Body Weight'): #Vt
                    try:
                        cursor.execute("INSERT INTO Vt (noadmsip, value, horodate) VALUES("+ str(noadmsip) + "," + str(i[1]) + ",datetime('" + str(i[2])[:19]+"'))")
                    except:
                        print('Vt:'+ str(i))

        cursor.execute("COMMIT;")#end transaction
        print('icca rangé')

        cur.execute('SELECT ph, po2, horodate, site FROM "readonly"."blood_gas" WHERE "noadmsip"='+ str(noadmsip) + ' AND "horodate" >' +"'" + str(limitDate) +"'" +' ORDER BY "horodate" DESC;')
        print('blood gas selected')
        dataBlood = cur.fetchall()
        cursor.execute("BEGIN;")#begin transaction
        for j in dataBlood:
            if(str(j[3]) =='ARTERIEL'):
                if(j[0] is not None):
                    try:
                        cursor.execute("INSERT INTO pH (noadmsip, source, value, horodate) VALUES("+ str(noadmsip) + ",'pH_ART'," + str(j[0]) + ",datetime('" + str(j[2])[:19]+"'))")
                    except:
                        print('pH art:'+ str(j))
                if(j[1] is not None):
                    try:
                        cursor.execute("INSERT INTO PaO2 (noadmsip, realV, value, horodate) VALUES("+ str(noadmsip) + ", 1," + str(j[1]) + ",datetime('" + str(j[2])[:19]+"'))")
                    except:
                        print('PaO2:'+ str(j))    
            elif(str(j[3]) =='VEINEUX'):
                if(j[0] is not None):
                    try:
                        cursor.execute("INSERT INTO pH (noadmsip, source, value, horodate) VALUES("+ str(noadmsip) + ",'pH_VEI'," + str(j[0]) + ",datetime('" + str(j[2])[:19]+"'))")
                    except:
                        print('pH vei:'+ str(j))
            elif(str(j[3]) =='CAPILLAIRE'):
                if(j[0] is not None):
                    try:
                        cursor.execute("INSERT INTO pH (noadmsip, source, value, horodate) VALUES("+ str(noadmsip) + ",'pH_CAP'," + str(j[0]) + ",datetime('" + str(j[2])[:19]+"'))")
                    except:
                        print('pH cap:'+ str(j))
        
        cursor.execute("COMMIT;")#end transaction
        print('blood gas rangé')
        
        cur.execute('SELECT hourtotal, charttime, interventionid FROM "readonly"."pttotalbalance" WHERE "encounterid"='+ str(noadmsip) + ' AND "interventionid" IN(68503,98385,30509) AND "charttime" >' +"'" + str(limitDate) +"'" +' ORDER BY "charttime" DESC;')
        print('bilan selected')
        bilan = cur.fetchall()
        
        cursor.execute("BEGIN;")#begin transaction
        for b in bilan:
            print(b)
            if(b[2]==68503):
                try:
                    print('ing')
                    cursor.execute("INSERT INTO Bilan(noadmsip, type, value, horodate) VALUES("+ str(noadmsip) + ", 'ing',"+ str(b[0])+",datetime('" + str(b[1])+"'))")
                except:
                        print('Bilan:'+ str(b))
            if(b[2]==98385):
                try:
                    print('exc')
                    cursor.execute("INSERT INTO Bilan(noadmsip, type, value, horodate) VALUES("+ str(noadmsip) + ", 'exc',"+ str(b[0])+",datetime('" + str(b[1])+"'))")
                except:
                        print('Bilan:'+ str(b))
            if(b[2]==30509):
                try:                    
                    print('dui')
                    cursor.execute("INSERT INTO Bilan(noadmsip, type, value, horodate) VALUES("+ str(noadmsip) + ", 'diu',"+ str(b[0])+",datetime('" + str(b[1])+"'))")
                except:
                        print('Bilan:'+ str(b))
        cursor.execute("COMMIT;")#end transaction
        print('bilan rangé')
        #Calcul et ajout ePaO2
        cursor.execute("SELECT * FROM Pouls WHERE noadmsip =" + str(noadmsip) + ' AND "horodate" >' +"'" + str(limitDate) +"'" +" ORDER BY horodate DESC")
        pouls = cursor.fetchall()
        print('pouls selected')

        cursor.execute("SELECT * FROM FC WHERE noadmsip =" + str(noadmsip) + ' AND "horodate" >' +"'" + str(limitDate) +"'" +" ORDER BY horodate DESC")
        fc = cursor.fetchall()
        print('fc selected')

        cursor.execute("BEGIN;")#begin transaction

        if(len(fc) > len(pouls)):
            i=0
            for p in pouls:
                if(float(fc[i][2])!=0):
                    prct = abs((float(p[2])- float(fc[i][2]))/float(fc[i][2]))
                    if(prct != 0 and prct < 0.03):
                        ePa = pow((pow(27.8, 2.8)/((1/prct)-0.99)), (1/2.8))
                        if ePa != 0:
                            cursor.execute("INSERT INTO ePaO2 (noadmsip, realV, value, horodate) VALUES("+str(noadmsip)+",0,"+ str(ePa)+",datetime('"+str(p[3])+"'))")
                i+=1
        else:
            i=0
            for f in fc:
                if(float(f[2])!=0):
                    prct = abs((float(pouls[i][2])- float(f[2]))/float(f[2]))
                    if(prct != 0 and prct < 0.03):
                        ePa = pow((pow(27.8, 2.8)/((1/prct)-0.99)), (1/2.8))
                        if ePa != 0:
                            cursor.execute("INSERT INTO ePaO2 (noadmsip, realV, value, horodate) VALUES("+str(noadmsip)+",0,"+ str(ePa)+",datetime('"+str(f[3])+"'))")
                i+=1
        cursor.execute("COMMIT;")#end transaction
        print('ajout (e)PaO2 done')
        
        #Calcul et ajout eOI
        cursor.execute("SELECT * FROM ePaO2 WHERE noadmsip =" + str(noadmsip) + ' AND "horodate" >' +"'" + str(limitDate) +"'" +" ORDER BY horodate DESC")
        epao2 = cursor.fetchall()
        print('epao2 selected')

        cursor.execute("SELECT * FROM FiO2 WHERE noadmsip =" + str(noadmsip) + ' AND "horodate" >' +"'" + str(limitDate) +"'" +" ORDER BY horodate DESC")
        fio2 = cursor.fetchall()
        print('fio2 selected')

        cursor.execute("SELECT * FROM Pressions WHERE noadmsip =" + str(noadmsip) + ' AND nom="MAwP" AND "horodate" >' +"'" + str(limitDate) +"'" +" ORDER BY horodate DESC")
        mawp = cursor.fetchall()
        print('mawp selected')

        cursor.execute("SELECT * FROM PaO2 WHERE noadmsip =" + str(noadmsip) + ' AND "horodate" >' +"'" + str(limitDate) +"'" +" ORDER BY horodate DESC")
        pao2 = cursor.fetchall()
        print('pao2 selected')

        cursor.execute("BEGIN;")#begin transaction

        if(len(fio2) > len(mawp)):
            if(len(epao2) != 0):
                for e in epao2:
                    eDate = datetime.datetime.strptime(e[4], '%Y-%m-%d %H:%M:%S')
                    j=0
                    for m in mawp:
                        mDate = datetime.datetime.strptime(m[4], '%Y-%m-%d %H:%M:%S')
                        if(eDate.strftime("%m")==mDate.strftime("%m") and 
                        eDate.strftime("%d")==mDate.strftime("%d") and
                        eDate.strftime("%H")==mDate.strftime("%H") and 
                        eDate.strftime("%M")==mDate.strftime("%M")):
                            if(float(e[3])!=0):
                                eOI= (fio2[j][2]*m[3]) / (e[3]*10)
                                cursor.execute("INSERT INTO eOI (noadmsip, realV, value, horodate) VALUES("+ str(noadmsip) +",0,"+str(eOI)+",datetime('"+str(m[4])+"'))")
                        j+=1
            
            if(len(pao2) != 0):
                for pA in pao2:
                    k = 0
                    for mA in mawp:
                        dateP = datetime.datetime.strptime(pA[4], '%Y-%m-%d %H:%M:%S')
                        dateM = datetime.datetime.strptime(mA[4], '%Y-%m-%d %H:%M:%S')
                        d2 = dateM + timedelta(milliseconds=30000)
                        if(dateP == dateM or (dateP > dateM and dateP <= d2)):
                            if(float(pA[3])!=0):
                                oi = ((float(fio2[k][2]) * float(mA[3]))/ float(pA[3]))
                                cursor.execute("INSERT INTO OI (noadmsip, realV, value, horodate) VALUES("+ str(noadmsip)+",1,"+ str(oi) +",datetime('"+ str(pA[4])+"'))")
        else:
            if(len(epao2) != 0):
                for e in epao2:
                    eDate = datetime.datetime.strptime(e[4], '%Y-%m-%d %H:%M:%S')
                    j=0
                    for f in fio2:
                        fDate = datetime.datetime.strptime(f[3], '%Y-%m-%d %H:%M:%S')
                        if(eDate.strftime("%m")==fDate.strftime("%m") and 
                        eDate.strftime("%d")==fDate.strftime("%d") and
                        eDate.strftime("%H")==fDate.strftime("%H") and 
                        eDate.strftime("%M")==fDate.strftime("%M")):
                            if(float(e[3])!=0):
                                eOI= (float(f[2])*float(mawp[j][3])) / (float(e[3])*10)
                                cursor.execute("INSERT INTO eOI (noadmsip, realV, value, horodate) VALUES("+ str(noadmsip)+", 0,"+str(eOI)+",datetime('"+str(f[3])+"'))")
                        j+=1
            
            if(len(pao2) != 0):
                for pA in pao2:
                    k = 0
                    for fI in fio2:
                        dateP = datetime.datetime.strptime(pA[4], '%Y-%m-%d %H:%M:%S')
                        dateF = datetime.datetime.strptime(fI[3], '%Y-%m-%d %H:%M:%S')
                        d2 = dateF + timedelta(milliseconds=30000)
                        if(dateP == dateF or (dateP > dateF and dateP <= d2)):
                            if(float(pA[3])!=0):
                                oi = ((float(fI[2]) * float(mawp[k][3]))/ float(pA[3]))
                                cursor.execute("INSERT INTO OI (noadmsip, realV, value, horodate) VALUES("+ str(noadmsip)+",1,"+ str(oi) +",datetime('"+ str(pA[4])+"'))")
        cursor.execute("COMMIT;")#end transaction
        print('ajout (e)OI done')
        
        #calcul hypoxemie
        cursor.execute("SELECT * FROM Ventilation WHERE noadmsip =" + str(noadmsip) + ' AND "horodate" >' +"'" + str(limitDate) +"'" +" ORDER BY horodate DESC")
        ventilation = cursor.fetchall()
        print('ventilation selected')
        cursor.execute("SELECT * FROM eOI WHERE noadmsip =" + str(noadmsip) + ' AND "horodate" >' +"'" + str(limitDate) +"'" +" ORDER BY horodate DESC")
        eoi = cursor.fetchall()
        print('eoi selected')

        cursor.execute("BEGIN;")#begin transaction

        for v in ventilation:
            vDate = datetime.datetime.strptime(v[3], '%Y-%m-%d %H:%M:%S')
            if(v == 1): #si ventilation invasive
                for eO in eoi:
                    eODate = datetime.datetime.strptime(eO[4], '%Y-%m-%d %H:%M:%S')
                    if(vDate > eODate and vDate <= eODate + thirtySeconds):
                        if(eO[3]<16):#modérée
                            cursor.execute("INSERT INTO Hypoxemie(noadmsip, severe, horodate) VALUES("+ str(noadmsip) + ", 0, datetime('" + str(eO[4])+"'))")
                        else:
                            cursor.execute("INSERT INTO Hypoxemie(noadmsip, severe, horodate) VALUES("+ str(noadmsip) + ", 1, datetime('" + str(eO[4])+"'))")
            else:
                for eP in epao2:
                    ePDate = datetime.datetime.strptime(e[4], '%Y-%m-%d %H:%M:%S')
                    if(vDate > ePDate and vDate <= ePDate + thirtySeconds):
                        if(eP[3]>100):#modérée
                            cursor.execute("INSERT INTO Hypoxemie(noadmsip, severe, horodate) VALUES("+ str(noadmsip) + ", 0, datetime('" + str(eP[4])+"'))")
                        else:
                            cursor.execute("INSERT INTO Hypoxemie(noadmsip, severe, horodate) VALUES("+ str(noadmsip) + ", 1, datetime('" + str(eP[4])+"'))")

        cursor.execute("COMMIT;")#end transaction
    
        """cursor.execute("SELECT * FROM Ventilation")
        cursor.execute("SELECT * FROM FC")
        cursor.execute("SELECT * FROM Pression")
        cursor.execute("SELECT * FROM Pouls")
        cursor.execute("SELECT * FROM SpO2")
        cursor.execute("SELECT * FROM Vt")
        cursor.execute("SELECT * FROM PaO2")
        cursor.execute("SELECT * FROM pH")
        cursor.execute("SELECT * FROM ePaO2")
        cursor.execute("SELECT * FROM eOI")
        cursor.execute("SELECT * FROM Bilan")
        """
        cursor.execute("SELECT * FROM Patients WHERE " +'"noadmsip"=' + str(noadmsip))
        info = cursor.fetchall()
        cursor.execute("SELECT * FROM Hypoxemie")
        hyp = cursor.fetchall()
        return([info, hyp])


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
