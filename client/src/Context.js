import React, {useState} from 'react'

const Context = React.createContext()

export default Context;

export const Provider = ({
  children
}) => {
  const [oauth, setOauth] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  
  const admin = {title:'Dr', name: 'DOE', email:'john.doe.med@ssss.gouv.qc.ca', password:'admin'}

  function findUser(oauth){
    if(admin.email == oauth.email){
    setCurrentUser(oauth)
    }
  }
  
  return (
    <Context.Provider value={{
      oauth: oauth,
      setOauth: (oauth) => {
        if(oauth){
          findUser(oauth)
        }
        setOauth(oauth)
      },
    }}>{children}</Context.Provider>
  )
}