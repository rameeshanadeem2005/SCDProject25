



const readline = require('readline');
const db = require('./db');
require('./events/logger'); // Initialize event logger
	const readlineSync = require('readline-sync');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function searchRecords(){


}
function menu() {
  console.log(`
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Records
6. Sort Records 
7. Export Data
8. Exit
=====================
  `);

  rl.question('Choose option: ', ans => {
    switch (ans.trim()) {
      case '1':
        rl.question('Enter name: ', name => {
          rl.question('Enter value: ', value => {
            db.addRecord({ name, value });
            console.log('✅ Record added successfully!');
            menu();
          });
        });
        break;

      case '2':
        const records = db.listRecords();
        if (records.length === 0) console.log('No records found.');
        else records.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`));
        menu();
        break;

      case '3':
        rl.question('Enter record ID to update: ', id => {
          rl.question('New name: ', name => {
            rl.question('New value: ', value => {
              const updated = db.updateRecord(Number(id), name, value);
              console.log(updated ? '✅ Record updated!' : '❌ Record not found.');
              menu();
            });
          });
        });
        break;

      case '4':
        rl.question('Enter record ID to delete: ', id => {
          const deleted = db.deleteRecord(Number(id));
          console.log(deleted ? '🗑️ Record deleted!' : '❌ Record not found.');
          menu();
        });
        break;

      case '5':
	
	rl.question('Enter search keyword: ', keyword => {
		const results = db.listRecords().filter(record =>
			record.id.toString() === keyword.trim() ||
		record.name.toLowerCase().includes(keyword.trim().toLowerCase())
	);
	if(results.length === 0){
		console.log('No records found.');
	}else{
		console.log(`Found ${results.length} matching records`);
		results.forEach((r,i)=>{
			console.log(`${i+1}. ID: ${r.id} | Name: ${r.name} | Created: ${r.created}`);
		});
	}
	menu();
});
	break;

      case '6':
	rl.question('Choose field to sort by (name/created): ', field =>{
		field = field.trim().toLowerCase();
		if(field !== 'name' && field !== 'created'){
			console.log('Invalid field. Use "name" or "created".');
			return menu();
		}
		rl.question('Choose order (ascending/descending); ', order=>{
			order=order.trim().toLowerCase();
			if(order !== 'ascending' && order !== 'descending'){
				console.log('Invalid order. Use "ascending" or "descending".');
				return menu();
			}
			const records=db.listRecords();
			if (records.length ===0){
				console.log('No records to sort.');
				return menu();
			}
			const sorted = [...records].sort((a,b)=>{
				let valA = a[field].toString().toLowerCase();
				let valB = b[field].toString().toLowerCase();

				if (valA < valB) return order === 'ascending' ? -1 : 1;
				if (valA > valB) return order ==='ascending' ? 1 : -1;
				return 0;
			});
			console.log('Sorted Records:');
			sorted.forEach((r,i) => {
			console.log(`${i+1}. ID: ${r.id} | Name: ${r.name} | Created: ${r.created}`);
	
	});
	menu();
	});	
	});
	break;

      case '7':
	const fs = require('fs');
	const path = require('path');

	const allRecords=db.listRecords();

	const exportPath = path.join(__dirname, 'export.txt');

	const header =
	`====== NodeVault Export ===================\n` +
	`Export Time: ${new Date().toLocaleString()}\n` +
	`Total Records: ${allRecords.length}\n` +
	`File: export.txt\n` +
	`==========================================\n\n`;

	let content= ' ';
	allRecords.forEach((r,i) =>{
		content += `${i+1}. ID: ${r.id} | Name: ${r.name} | Value: ${r.value} | Created: ${r.created}\n`;
	});

	fs.writeFileSync(exportPath, header + content);

	console.log('Data exported successfully to export.txt!\n');
	menu();
	break;
      
	case '8':
        console.log('👋 Exiting NodeVault...');
        rl.close();
        break;


      default:
        console.log('Invalid option.');
        menu();
    }
  });
}

menu();

