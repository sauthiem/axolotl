# Axolotl : Interface for the evaluation of hypoxemia in PICUs
This project was conceived by the CHU Sainte-Justine research center to help intensive care physicians make major decisions about the future treatment of a patient.

The objective of this project is to illustrate the trend of all the main indices used in the evaluation of hypoxemia so that physicians can have a clearer idea of the patient's condition and can administer care accordingly. They will be able to browse the interface to assimilate all the relevant information in the assessment of hypoxemia. 

## Programming languages
To establish the link between the backend and the frontend, we used the [Axios 1.2.1](https://axios-http.com/fr/docs/intro) library. This library provides various methods for executing HTTPS requests like GET, POST, PUT, and DELETE specifically designed for JavaScript frameworks.

### Backend
The backend of the interface is programmed in [Python 3.11](https://wiki.python.org/moin/BeginnersGuide). We used [Flask 2.2](https://flask.palletsprojects.com/en/2.2.x/) to create it, a framework that provides useful tools and features that helps building web applications in Python. To communicate with the database, we used [PostgreSQL 12](https://www.postgresql.org/docs/15/index.html), a relational and object database management system. 

We implemented a cache database [SQLite3](https://www.sqlite.org/index.html) library to improve the reactivity of the app. 

### Frontend
The frontend site is coded in JavaScript, more specifically using the [React JS](https://reactjs.org/versions) library. The components used are taken from [Material UI 5.11.12](https://mui.com/material-ui/getting-started/overview/). [ChartJS 4.2.1](https://www.chartjs.org/docs/latest/) library was used to create the configurable charts.

## Use Axolotl

### Launch the app
To launch the app, download the source code and run the backend. 
```bash
python flask-server/server.py 
```
Then launch the frontend.
```bash
npm start client
```
Open [http://localhost:3587](http://localhost:3587) to view it in your browser.

### Navigate throught the app

First, you will come across the login page: identify yourself using your hospital ID and password.

Next, you will be able to choose the patient whose information you wish to see. Select the bed in which the patient is staying. 

Once de data is loaded, you will arrive on the page that we have named "Overview". On the left side you will find information about the patient. In the center, you will find an overview of each graph relevant to show the complete oxygenation status of the patient. 
The red boxes around some of the graphs indicate that this measurement requires special attention because more than 50% of the values are outside the norm.

The data are initially represented over 48 hours but you can change the time interval in the upper right corner. 

Then, it is possible to click on any graph to have more detailed information on it.

To change patient or logout, use the menu drawer.

### Options
- Change language : English, French and Spanish.
- Night mode.
- Creation of charts.
- Storage actions (on the cache database).
