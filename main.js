const connectMongo = require("./db/mongo");
const fs =require('fs');
const path = require('path');

const readline = require('readline');
const db = require('./db');
const readDB = db.listRecords;
require('./events/logger'); // Initialize event logger
	const readlineSync = require('readline-sync');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

connectMongo();

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
8. Restore Backup
9. View Vault Statistics
10. Exit
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


case '5': // Search Records
  rl.question('Enter search keyword: ', keyword => {
    const results = db.listRecords().filter(record =>
      record.id.toString() === keyword.trim() ||
      record.name.toLowerCase().includes(keyword.trim().toLowerCase())
    );

    if (results.length === 0) {
      console.log('No records found.');
    } else {
      console.log(`Found ${results.length} matching records:`);
      results.forEach((r, i) => {
        console.log(`${i + 1}. ID: ${r.id} | Name: ${r.name} | Created: ${r.created}`);
      });
    }

    menu(); // show menu again
  });
  break;

        case '5':
        console.log('👋 Exiting NodeVault...');
        rl.close();
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
	const backupsDir = path.join(__dirname, 'backups');
	const files = fs.readdirSync(backupsDir).filter(f => f.endsWith('.json'));

	if(files.length === 0){
		console.log("No backup files found.");
	}

	console.log("\nAvailabe Backups:");
	files.forEach((file, index)=> {
		console.log(`${index + 1}. ${file}`);
	});

	rl.question("\nEnter backup number to restore: ", num=>{
		const index=Number(num) - 1;

		if(index<0 || index>= files.length){
			console.log("Invalid selection.");
			return menu();
		}

		const selectedFile = files[index];
		const backupPath = path.join(backupsDir, selectedFile);
		const data = fs.readFileSync(backupPath, 'utf8');

		fs.writeFileSync(path.join(__dirname, 'data', 'vault.json'), data);
		db.reloadData();

		console.log(`\n Backup restored successfully from ${selectedFile}`);
		menu();

	});
	break;

	case '9':
		const statsData = db.listRecords();

	console.log("\nVault Statistics:");
	console.log("---------------------------");
	console.log(`Total Records: ${statsData.length}`);

	const stats = fs.statSync(path.join(__dirname, 'data', 'vault.json'));
	const lastModified = stats.mtime.toLocaleString();
	console.log(`Last Modified: ${lastModified}`);

	if(statsData.length === 0){
		console.log("\n(Other statistics unavailable because vault is empty)");
		menu();
		break;
	}

	let longestRecord = statsData.reduce((max, r)=>
		r.name.length > max.name.length ? r : max
	);

	console.log(`Longest Name: ${longestRecord.name} (${longestRecord.name.length} characters)`
	);
	
	const sortedByDate = [...statsData].sort((a,b)=>
		new Date(a.created) - new Date(b.created)
	);

	const earliest = sortedByDate[0].created;
	const latest = sortedByDate[sortedByDate.length - 1].created;

	console.log(`Earliest Record: ${earliest}`);
	console.log(`Latest Record: ${latest}`);
	menu();
	break;


	case '10':
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

