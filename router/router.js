const express = require('express');
const { getUsers, addUser, login } = require('../controllers/authcontroller');
const { insertSimulatedData } = require('../dump');
const { fetchMasterData } = require('../controllers/fetch_controller');
// const { getUsers,addRole, registerUser, loginUser, saveSensorData,saveSensorData2, getSensors, getRoles, adddesignation, getdesignation, deleteRole, DeleteDesignation, test, updateConfigs, getconfigs, updateStationConfig, getStationconfigs, editUser, addLog, getSensorsrr, getSensorsTime } = require('../controllers/controller');

const router = express.Router();

router.get('/users', getUsers);
router.post('/register', addUser);
router.post('/login', login);
router.post('/insert-simulated-data', insertSimulatedData);



// fetch master data route

router.post('/fetch-master', fetchMasterData);

module.exports = router;