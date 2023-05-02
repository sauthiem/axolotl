import { fabClasses } from "@mui/material";
import { spoText } from "./Text";
import moment from "moment"

export function translateDays(day, lg){
  if(day =='Sun'){
    return spoText.jours[lg][0];
  }
  if(day=='Mon'){
    return spoText.jours[lg][1];
  }
  if(day=='Tue'){
    return spoText.jours[lg][2];
  }
  if(day=='Wed'){
    return spoText.jours[lg][3];
  }
  if(day=='Thu'){
    return spoText.jours[lg][4];
  }
  if(day=='Fri'){
    return spoText.jours[lg][5];
  }
  if(day=='Sat'){
    return spoText.jours[lg][6];
  }
}

export function translateMonths(month, lg){
  if(month =='Jan'){
    return spoText.mois[lg][0];
  }
  if(month=='Feb'){
    return spoText.mois[lg][1];
  }
  if(month=='Mar'){
    return spoText.mois[lg][2];
  }
  if(month=='Apr'){
    return spoText.mois[lg][3];
  }
  if(month=='May'){
    return spoText.mois[lg][4];
  }
  if(month=='Jun'){
    return spoText.mois[lg][5];
  }
  if(month=='Jul'){
    return spoText.mois[lg][6];
  }
  if(month =='Aug'){
    return spoText.mois[lg][0];
  }
  if(month=='Sep'){
    return spoText.mois[lg][1];
  }
  if(month=='Oct'){
    return spoText.mois[lg][2];
  }
  if(month=='Nov'){
    return spoText.mois[lg][3];
  }
  if(month=='Dec'){
    return spoText.mois[lg][4];
  }
}

export function calculAge(date){
  let a = moment(date);
  let b = moment(new Date());
    
  let y = b.diff(a, 'year')
    
  a = a.add(y, 'year')
    
  let m = b.diff(a, 'month')
    
  a = a.add(m, 'month')
    
  let d = b.diff(a, 'day')
    
  a = a.add(d, 'day')
  
return [y,m,d]  
}

export function calculMediane(valeurs){
    const m = Math.floor(valeurs.length / 2),
    nums = valeurs.sort((a, b) => a - b);
    if(valeurs.length % 2 !== 0){
      return (Number.parseFloat(nums[m-1]) + Number.parseFloat(nums[m]))/2
    }else{
      return Number.parseFloat(nums[m])
    }
  }

export function ePaO2Calcul(pouls, fc){
    pouls.sort(function(a, b) {//Tri par ordre décroissant
      var c = new Date(a.horodate);
      var d = new Date(b.horodate);
      return c-d;
    });
    fc.sort(function(a, b) {//Tri par ordre décroissant
      var c = new Date(a.horodate);
      var d = new Date(b.horodate);
      return c-d;
    });
    let ePaO2 = {horodate:[], valeur:[], real: []}
    if(fc.length > pouls.length){ //On vérifie dans lequel il y a plus de valeurs pour éviter les "index out of range"
      pouls.map((p, i)=>{ //On parcourt le plus petit des deux tableaux, mêmes horaires (toutes les 30sec) 
        const prct = Math.abs((p.valeur - fc[i].valeur)/ fc[i].valeur)//Calcule de la différence entre le pouls et fc 
        if(prct < 0.03){
          const ePa = Math.pow((Math.pow(27.8, 2.8)/ ((1/prct)-0.99)), (1/2.8))//estimation PaO2
          if(ePa != 0){
            ePaO2.horodate.push(p.horodate)
            ePaO2.valeur.push(ePa)
            ePaO2.real.push(false)//pour différentier l'estimation et la vrai PaO2
          }
        }    
      });
    }else{
      fc.map((f, i)=>{//pareil si FC a moins de valeurs
        const prct = Math.abs((pouls[i].valeur - f.valeur)/ f.valeur)
        if(prct < 0.03){
          const ePa = Math.pow((Math.pow(27.8, 2.8)/ ((1/prct)-0.99)), (1/2.8))
          if(ePa != 0){
            ePaO2.horodate.push(f.horodate)
            ePaO2.valeur.push(ePa)
            ePaO2.real.push(false)
          }
        }    
      });
    }
    
    return ePaO2
}

export function eOICalcul(epao2, fio2, mawp){
    let eOI = {horodate:[], valeur:[], real : []}
    if(epao2.horodate.length != 0){
      if(fio2.length > mawp.length){//On vérifie dans lequel il y a plus de valeurs pour éviter les "index out of range"
        epao2.horodate.map((f, i)=>{
          const h1 = new Date(f)
          mawp.map((m,j)=>{//On parcourt le plus petit des deux tableaux, mêmes horaires (toutes les 30sec)
              const h2 = new Date(m.horodate)
              if(h1.getDate() == h2.getDate() && 
              h1.getHours() == h2.getHours() && 
              h1.getMinutes() == h2.getMinutes()){ //on prend les valeurs de mawp et fio2 qui relevées à la même minute que celle de ePaO2
                  eOI.horodate.push(h1)
                  eOI.valeur.push((fio2[j].valeur * m.valeur) / (epao2.valeur[i]*10))//calcul de eOI
                  eOI.real.push(false)//pour différentier l'estimation et le vrai OI
              }
          })    
      });
      }else{
        epao2.horodate.map((f, i)=>{//la même chose si fio2 a moins de valeurs
            const h1 = new Date(f)
            fio2.map((k,j)=>{
                const h2 = new Date(k.horodate)
                if(h1.getDate() == h2.getDate() && 
                h1.getHours() == h2.getHours() && 
                h1.getMinutes() == h2.getMinutes()){
                    eOI.horodate.push(h1)
                    eOI.valeur.push((k.valeur * mawp[j].valeur) / (epao2.valeur[i]*10))
                    eOI.real.push(false)
                }
            })    
        });
      }
         
    }
    return eOI
}

export function OICalcul(pao2, fio2, mawp){
    let OI = {horodate:[], valeur:[], real: []}
    if(pao2.length != 0){
      if(fio2.length > mawp.length){//On vérifie dans lequel il y a plus de valeurs pour éviter les "index out of range"
        pao2.map((f, i)=>{
          const h1 = new Date(f.horodate)
          mawp.map((m,j)=>{//On parcourt le plus petit des deux tableaux, mêmes horaires (toutes les 30sec)
              const h2 = new Date(m.horodate)
              if(h1.getTime() == h2.getTime() || //Ils sont relevés à la même minute
              (h1.getTime() > h2.getTime() && h1.getTime() <= h2.getTime() + 30000)){ //ou à 30sec près
                OI.horodate.push(h1)
                OI.valeur.push((fio2[j].valeur * m.valeur) / pao2[i].valeur)//calcul de OI
                OI.real.push(true)//pour différentier l'estimation et le vrai OI
              }
          })    
        }); 
      }else{
        pao2.map((f, i)=>{//la même chose si fio2 a moins de valeurs
            const h1 = new Date(f.horodate)
            fio2.map((k,j)=>{
                const h2 = new Date(k.horodate)
                if(h1.getTime() == h2.getTime() || 
                (h1.getTime() > h2.getTime() && h1.getTime() <= h2.getTime() + 30000)){ 
                  OI.horodate.push(h1)
                  OI.valeur.push((k.valeur * mawp[j].valeur) / pao2[i].valeur)
                  OI.real.push(true)
                }
            })    
        }); 
      }
        
    }
    return OI
}

export function determinerHypoxemie(ventilation, eoi, epao2){
  let hypo = []
  ventilation.map((v,i)=>{ //le tableau "ventilation" contient des boolean (invasif = True, non invasif = False) et des horodates 
    const hor = new Date(v.horodate)
    if(v.mesure){//si invasif
      eoi.horodate.map((o,j)=>{ //on parcourt eOI
        const horH = new Date(o)
        if(hor.getTime() > horH.getTime() && hor.getTime() <= horH.getTime() + 30000){//Ils sont relevés à la même minute ou à 30sec près
          if( eoi.valeur[j] < 16){ //Si eOI<16, hypoxémie modérée
            hypo.push([0,o]) //0 pour modérée, puis l'horodate
          }else{
            hypo.push([1,o]) //1 pour sévère, puis l'horodate
          }
        }
      })
    }else{//si non invasif
      epao2.horodate.map((p,k)=>{//on parcourt ePaO2
        const horH = new Date(p)
        if(hor.getTime() > horH.getTime() && hor.getTime() <= horH.getTime() + 30000){//Ils sont relevés à la même minute ou à 30sec près
          if( epao2.valeur[k] > 100){//Si ePaO2 > 100
            hypo.push([0,p])//0 pour modérée, puis l'horodate
          }else{
            hypo.push([1,p])//1 pour sévère, puis l'horodate
          }
        }
      })
    }
  })
  return hypo //tableau qui contient de 0 et 1 qui concordent avec une horodate selon la gravité de l'hypoxémie en tout temps
}

export function displayDatesRange(mesure, bis){
    let days = {horaires:[], valeurs:[]}
    mesure.map((h, i)=>{
      if(!bis){
        const hor = new Date(h[3])
        days.horaires.push(hor)
        days.valeurs.push(h[2]) 
      }else{
        const hor = new Date(h[4])
        days.horaires.push(hor)
        days.valeurs.push(h[3]) 
      } 
    });
    return days
} 
  
export function displayPH(mesures){
  let art = []
  let cap = []
  let vei = []
  let hor = []
  mesures.map((m,i)=>{
    const h = new Date(m[4])
    if(m.nom == 'pH_ART'){
      art.push(m[3])
      cap.push(NaN)
      vei.push(NaN)
    }else if(m.nom == 'pH_CAP'){
      art.push(NaN)
      cap.push(m[3])
      vei.push(NaN)
    }else{
      art.push(NaN)
      cap.push(NaN)
      vei.push(m[3])
    }
    hor.push(h)
  })
  return [hor,art,vei,cap]
}

export function displayPF(epao2, fio2){
  let days = {horaires:[], valeurs:[]}
  epao2.map((p,i)=>{
    const horH = new Date(p[4])
    fio2.map((k,j)=>{
      const horK = new Date(k[3])
      if(horK.getTime() > horH.getTime() && horK.getTime() <= horH.getTime() + 30000){
        const ratio = (p[3]*10/k[2]) * 100
        if(!isNaN(ratio)){
          days.horaires.push(horH)
          days.valeurs.push(ratio) 
        }   
      }
    })
  })
  return days
} 

export function displayPressions(mesure){
  let mawp = []
  let peep = []
  let horodates = []
  mesure.map((h, i)=>{
    horodates.push(h[4])
    if(h[2]=='MAwP'){
      mawp.push(h[3])
      peep.push(NaN)
    }
    if(h[2]=='PEEP'){
      peep.push(h[3])
      mawp.push(NaN)
    }
  });
  return [horodates, mawp, peep]
}

export function concatOIndice(eoi, OI){
  let tog = []
  let newTabH = eoi.horodate.concat(OI.horodate)
  let newTabV = eoi.valeur.concat(OI.valeur)
  let newTabR = eoi.real.concat(OI.real)
  newTabH.map((h,i)=>{
    tog.push([h, newTabV[i], newTabR[i]])
  })
  tog.sort(function(a, b) {
    var c = new Date(a[0]);
    var d = new Date(b[0]);
    return c-d;
  });
  return tog
}

export function concatPa02(epao2, pao2){
  let tog = []
  let pao2Tab = {horodate:[], valeur: [], real :[]}
  pao2.map((p,i)=>{
    pao2Tab.horodate.push(p.horodate)
    pao2Tab.valeur.push(p.valeur)
    pao2Tab.real.push(true)
  })
  let newTabH = epao2.horodate.concat(pao2Tab.horodate)
  let newTabV = epao2.valeur.concat(pao2Tab.valeur)
  let newTabR = epao2.real.concat(pao2Tab.real)
  newTabH.map((h,i)=>{
    tog.push([h, newTabV[i], newTabR[i]])
  })
  tog.sort(function(a, b) {
    var c = new Date(a[0]);
    var d = new Date(b[0]);
    return c-d;
  });
  return tog
}

export function calculConformite(values, inf, sup){
  let i = 0
  let j = 0
  values.forEach(v =>{
    if(!isNaN(v)){
      if(inf == null){
        if(v<sup){
          i++
        }
      }else if (sup == null){ // seulement 1 borne inférieure
        if(v>inf){
          i++
        }
      }else{// 2 bornes
        if(v<sup && v>inf){
          i++
        }
      }
    }
    j++
  })
  return Math.round(i * 100 / j)
}