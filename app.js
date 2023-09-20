const express = require('express');
const path = require('path');
const DB = require('./includes/connectDB');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { generateComplexValue } = require('./includes/lib');


const app = express();
const port = 2001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const dataBases = new DB();



const onLoad = async (req, res, next) => {
    if (!req.cookies.starter) {
        const valeurCookie = generateComplexValue(12);

        res.cookie('starter', valeurCookie, { maxAge: 3600000 });

        const nouvelVisiteur = {
            cookie: valeurCookie,
            adresse_ip: req.ip,
            country: 'NN',
            count_visite: 1,
            last_visite: 0,
            first_visite: 0
        };

        try {
            const idNouvelVisiteur = await dataBases.put('visitor', nouvelVisiteur);
            // const insertedId = await dataBases.put('visitor', ['cookie', 'adresse_ip', 'country', 'count_visite', 'last_visite', 'first_visite'], [nouvelVisiteur.cookie, nouvelVisiteur.adresse_ip, nouvelVisiteur.country, nouvelVisiteur.count_visite, nouvelVisiteur.last_visite, nouvelVisiteur.first_visite]);
            console.log(`Nouveau visiteur inséré avec l'ID : ${idNouvelVisiteur}`);
        }
        catch (error) {
            console.error('Erreur lors de l\'insertion du visiteur : ', error);
        }
    }

    next();
};

app.use(onLoad);

app.get('/', async (req, res) => {
    const page_data = {
        'title': 'Acceuil',
        'titre': 'Bienvenue à l\'acceuil'
    };
    try {
        const data_table = await dataBases.get('data', '', [], 'id_data', true, 0, 0);

        if (data_table.length > 0) {
            const APP_NAME = data_table[0]['value'];

            console.log('L\'app name est:', APP_NAME);
        }
        else {
            console.log('Aucune entrée trouvée.');
        }
        res.render('index', { data_table, page_data });
    }
    catch (err) {
        console.error('Erreur lors de la récupération des données :', err);
        res.status(500).send('Erreur de base de données');
    }
});

app.get('/contact-us', async (req, res) => {
    const page_data = {
        'title': 'Contact-us',
        'titre': 'Bienvenue à la page de contacts'
    };
    res.render('contact-us', { page_data: page_data });
});

app.post('/cf', async (req, res) => {
    try {
        const { first_name, last_name, email, tel, message } = req.body;
        const timestamp = Date.now();
        const secondes = Math.floor(timestamp / 1000);

        const insertedId = await dataBases.put('contact_us', {
            'lang': 'fr',
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'tel': tel,
            'message': message,
            'timing': secondes
        });

        res.send('Votre message a été envoyé avec succès.');

    } catch (error) {
        console.error('Erreur lors du traitement de la requête POST :', error);
        
        res.status(500).send('Une erreur s\'est produite lors de l\'envoi du message.');
    }
});

app.use((req, res, next) => {
    res.status(404).render('404');
});

app.listen(port, () => {
    console.log(`Serveur Express.js fonctionnant sur le port ${port}`);
});