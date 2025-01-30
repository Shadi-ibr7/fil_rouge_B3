require("dotenv").config();
const EventList = require("../model/eventList");
const userList = require('../model/model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const UserList = require("../model/model");
const secretKey = process.env.SECRET_KEY;

// Middleware
module.exports.checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Accès refusé. Vous n'êtes pas administrateur.",
    });
  }
  next();
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(file.originalname.toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Erreur : Seuls les fichiers images (jpg, jpeg, png, gif) sont autorisés.");
  }
};

const upload = multer({
  storage,
  fileFilter,
}).single("image");

const CreateEvents = async (req, res) => {
  const { title, description, category, location, contactInfo, createdBy , dateEvent , dateCreated} = req.body;

  if (!title || !description || !category || !dateEvent || !location || !dateCreated) {
    return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
  }

  let parsedContactInfo;
  try {
    parsedContactInfo = contactInfo ? JSON.parse(contactInfo) : undefined;
  } catch {
    return res.status(400).json({
      message: "Les informations de contact doivent être un JSON valide.",
    });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Veuillez télécharger une image pour l'événement." });
  }

  try {
    const newEvent = new EventList({
      title,
      description,
      category,
      dateEvent,
      dateCreated,
      location,
      image: req.file.buffer,
      contactInfo: parsedContactInfo,
      createdBy,
    });

    await newEvent.save();
    res.status(201).json({ message: "Événement créé avec succès.", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'événement.", error });
  }
};

// Récupérer tous les événements
const fetchEvents = async (req, res) => {
  try {
    const events = await EventList.find();
    const transformedEvents = events.map((event) => ({
      ...event.toObject(),
      image: event.image
        ? `data:image/jpeg;base64,${event.image.toString("base64")}`
        : null, // Assurez-vous que l'image est encodée en base64 pour le frontend
    }));
    res.status(200).json({ events: transformedEvents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des événements." });
  }
};


//Récuperer l'utilisateur connecter
const fetchUser = async (req, res) => {
  const { idUser } = req.params; 
  try {
    const user = await UserList.find({ _id: idUser }); 
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'user" });
  }
};


module.exports = {
  upload,
  CreateEvents,
  fetchEvents,
  fetchUser
};
