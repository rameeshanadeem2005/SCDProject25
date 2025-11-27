//const createBackup = require('./backup');
//const fileDB = require('./file');
//const recordUtils = require('./record');
//const vaultEvents = require('../events');

//function addRecord({ name, value }) {
 // recordUtils.validateRecord({ name, value });
//  const data = fileDB.readDB();
 // const newRecord = { id: recordUtils.generateId(), name, value, created: new Date().toISOString().split('T')[0]};
  //data.push(newRecord);
//  fileDB.writeDB(data);
//  createBackup(data);
// vaultEvents.emit('recordAdded', newRecord);
//  return newRecord;
//}

//function listRecords() {
 // return fileDB.readDB();
//}

//function updateRecord(id, newName, newValue) {
//  const data = fileDB.readDB();
//  const record = data.find(r => r.id === id);
//  if (!record) return null;
//  record.name = newName;
//  record.value = newValue;
//  fileDB.writeDB(data);
//  vaultEvents.emit('recordUpdated', record);
//  return record;
//}

//function deleteRecord(id) {
//  let data = fileDB.readDB();
//  const record = data.find(r => r.id === id);
//  if (!record) return null;
//  data = data.filter(r => r.id !== id);
//  fileDB.writeDB(data);
//  createBackup(data);
// vaultEvents.emit('recordDeleted', record);
//  return record;
//}

//module.exports = { addRecord, listRecords, updateRecord, deleteRecord };
const Record = require("./recordModel");

async function addRecord({name,value}){
	const newRecord = await Record.create({name,value});
	return newRecord;
}

async function listRecords(){
	return await Record.find({});
}

async function updateRecord(id, newValue, newValue){
	return await Record.findByIdAndUpdate(
		id,
		{name: newName, value: newValue},
		{new: true}
	);
}

async function deleteRecord(id){
	return await Record.findByIdAndDelete(id);
}

module.exports={addRecord, listRecords, updateRecord, deleteRecord};
