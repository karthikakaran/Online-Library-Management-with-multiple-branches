var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

//CONNECTION TO DB
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "28111988",
  database: "library_db"
});

//CHECK OUT APIs
//SEARCH OR FETCH FOR CHECK OUT
app.get('/bookList/:book_id/:title/:authorFname/:authorLname', function(req, res){
   var remainCopies = [];
   var bookList = [];

   con.query('select book_id, count(book_id) as count_to_deduct, branch_id from book_loans where date_in is null group by      			book_id,branch_id', 
	function (err, rows) {
   	  if(err){
    	    console.log('Error selecting the Table'+err);
    	    return;
	  }
   	remainCopies = rows;
   });
console.log(req.params.title +" "+req.params.book_id+" "+ req.params.authorFname,+" "+ req.params.authorLname);
   con.query('SELECT b.book_id, title, author_name, branch_id, no_of_copies FROM BOOK b, authView ba, book_copies bc WHERE (b.book_id 	REGEXP ? and b.title REGEXP ? and ba.author_name REGEXP ? and ba.author_name REGEXP ?) AND b.book_id = ba.book_id AND b.book_id = 	   	bc.book_id', [req.params.book_id, req.params.title, req.params.authorFname, req.params.authorLname],
   	function (err, rows) {
   	  if(err){
    	    console.log('Error selecting the Table'+err);
    	    return;
          }
	  console.log('Data received from Db for check out'+rows.length+" "+remainCopies.length);
	  bookList = rows;
          for (var i=0; i<rows.length; i++){
		bookList[i]["r_copies"] = rows[i].no_of_copies;
		for (var j=0; j<remainCopies.length; j++){
		   if(rows[i].book_id == remainCopies[j].book_id && rows[i].branch_id == remainCopies[j].branch_id) {
			bookList[i]["r_copies"] = Math.max(0,rows[i].no_of_copies - remainCopies[j].count_to_deduct);
                   }
		}
	  }
          if (bookList.length == 0)
		res.send("No book found for this criteria");
	  else          
		res.json(bookList);
   });
   console.log('I received a request');
});

//CHECK OUT UPDATES
app.post('/bookList', function(req, res){
   var books_checkedOut;

   //CHECKING THE NO OF BOOKS THE BORROWER HAD ALREADY TAKEN	
    con.query('select count(*) as no_books from book_loans where card_no = ? and date_in is NULL', [req.body.card_no],
   	function (err, rows) {
   	  if(err){
    	  	console.log('Error selecting the Table'+err);
    	  	return;
          }
	  books_checkedOut = rows[0].no_books;
          console.log('Checking the no of books the student had checked out already'+ books_checkedOut);
        
	     //DATA INSERTED INTO THE BOOK LOANS
	  if (books_checkedOut < 3){
		con.query('insert into book_loans(book_id, branch_id, card_no, date_out, due_date, date_in) values(?, ?, ?, curDate(), DATE_ADD(curDate(), INTERVAL 14 DAY),  NULL)',
	   	[req.body.book_id.toString(), req.body.branch_id, req.body.card_no],
	   	function (err, rows) {
	   	  if(err){
	    	  	console.log('Error selecting the Table'+err);
			res.send("Member not registered to the system, enter a valid card no!!!");
	    	  	return;
		  }
		  console.log('Data inserted into Book loans'+books_checkedOut);
		  res.send("Book " + req.body.book_id + " is checked out");
		});
	     }
	  else{
		 res.send(books_checkedOut + " books are already checked out");
	  }   
 });
});

//CHECK IN APIs
//FETCH FOR CHECK-IN SEARCH
app.get('/bookLoanList/:card_no/:book_id/:fname/:lname', function(req, res){
console.log(req.params.card_no +" "+req.params.book_id+" "+ req.params.fname+" "+ req.params.lname);
     con.query('SELECT book_id, loan_id, b.card_no, branch_id, date_out, due_date FROM book_loans l, borrower b WHERE l.card_no = b.card_no 	 and (l.card_no = ? and (book_id REGEXP ? and fname REGEXP ? and lname REGEXP ?)) and date_in is NULL',
   	[req.params.card_no, req.params.book_id, req.params.fname, req.params.lname],
   	function (err, rows) {
   	  if(err){
    	    console.log('Error selecting the book loan Table'+err);
    	    return;
          }
	  else{
	  	console.log('Data received from book loan with borrower name'+rows.length);
          	if (rows.length == 0)
			res.send("Enter card no or No book found for this criteria");
	  	else    
			res.json(rows);
	  }
     });
});

//CHECK IN THE BOOK
app.post('/bookLoanCheckIn', function(req, res){
	con.query('UPDATE book_loans SET date_in = curDate() WHERE loan_id = ?',
   	[req.body.loan_id],
   	function (err, rows) {
   	  if(err){
    	    console.log('Error updating the book loans Table'+err);
    	    return;
          } 
	  else{
	  	console.log('Date in updated in book loans');
          	res.send('Checked in the book');
	  }
        });
	con.query('UPDATE book_copies SET no_of_copies = no_of_copies + 1 WHERE book_id = ? and branch_id = ?',
   	[req.body.book_id, req.body.branch_id],
   	function (err, rows) {
   	  if(err){
    	    console.log('Error updating the book copies Table'+err);
    	    return;
          } 
	  else{
	  	console.log('No of copies updated in book copies');
	  }
        });
});

//BORROWER ADDITION
app.post('/borrowerDetails', function(req, res){
   //ADD NEW BORROWER INTO TABLE
   con.query('insert into borrower(fname, lname, email, address, phone) values(?, ?, ?, ?, ?)',
   [req.body.fname.toString(), req.body.lname.toString(), req.body.email.toString(), req.body.address.toString(),req.body.phone],
   	function (err, rows) {
   	  if(err){
    	  	console.log('Error inserting into Borrower Table'+err);
		res.send("The borrower cannot be added, she/he is already enrolled!");
    	  	return;
          }
	  else {
		con.query('select card_no from borrower where fname = ? and lname = ? and email = ? and address = ?',
		   [req.body.fname.toString(), req.body.lname.toString(), req.body.email.toString(), req.body.address.toString()],
		   	function (err, rows) {
		   	  if(err){
		    	  	console.log('Fetching Borrower Details'+err);
				res.send("The borrower cannot be added, she/he is already enrolled!");
		    	  	return;
			  } else {
				console.log('Borrower details fetched succesfully');
				res.send("New borrower added\n CARD NO : "+ rows[0].card_no);
			  }
		});
		console.log('Borrower details inserted');
	 }
	//res.send("New borrower card_no is added");
   });
});

//REFRESH FINES
app.post('/refreshFines', function(req, res){
	con.query('select loan_id, date_out, due_date from book_loans where  (date_in is null or date_in > due_date) and due_date < curDate()',
	function(err, rows){
		if (err){
			console.log('Error fetching from book loans while refreshing');	
			return;
		}
		dueValues = rows;
   	
		var d = new Date();
		var d2 = new Date();
		var loanId2 = 0;
		// RETURN THE DAY DIFFERENCE
		function diffBwDateInDays(a, b) {
		    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
		    // REMOVE THE TIME ZONE INFORMATION
		    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
		    return Math.floor((utc1 - utc2) / _MS_PER_DAY);
		}
	
		for (var i=0; i<dueValues.length; i++){
			d2 = dueValues[i].due_date;
			loanId2 = dueValues[i].loan_id;	

			con.query('insert into FINES(loan_id, fine_amt, paid) values(?, ?, ?)',
			[loanId2, 0.25 * Math.max(0, (diffBwDateInDays(d , d2))), false],
			function(err, rows){
				if (err != null && err.sqlState == 23000){
					console.log('Needs Update');
					return;
				} else { console.log('Inserted Fines'); 
				}
		   	});
		
			con.query('update FINES set fine_amt = ? where loan_id = ? and paid = false',
			[0.25 * Math.max(0, (diffBwDateInDays(d , d2))), loanId2],
			function(err, rows){
				console.log('Fines Updated');
		   	});
		}
		res.send('Refreshed');
	});
});

//FIND TOTAL FINE AMOUNT
app.get('/fetchTotalFineAmt/:cardNo/', function(req, res){
	con.query('select sum(fine_amt) as "totalFine" from FINES f ,book_loans l where f.loan_id=l.loan_id and card_no = ? and paid = false group by card_no',		[req.params.cardNo],
	function(err, rows){
		if (err){
			console.log('Error fetching total fine amt'+err);	
			return;
		} 
		if(rows[0] == undefined)
			res.send('The card holder does not have any fines or \nNo such card exists');
		else		
			res.json(rows[0].totalFine);
	});
	console.log('fetchTotalFineAmt successful');
});

//FETCH INIVIDUAL FINE FOR BOOKS
app.get('/fetchFines/:cardNo/', function(req, res){
	con.query('select f.loan_id, book_id, branch_id, date_out, due_date, fine_amt from FINES f, book_loans l where f.loan_id=l.loan_id and card_no = ? and fine_amt > 0',[req.params.cardNo],
	function(err, rows){
		if (err){
			console.log('Error fetching from fines fetch'+err);	
			return;
		}
		if(rows[0] == undefined)
			res.send('The card holder does not have any fines or \nNo such card exists');
		else		
			res.json(rows);	
	});
	console.log('fetchFines successful');
});

//CHECK IF THE BORROWER HAS RETURN DUE BOOKS
app.get('/checkinVerification/:cardNo/', function(req, res){
	con.query('select count(*) as "dueBooks" from book_loans where card_no = ? and date_in is NULL and due_date < curDate()', 		[req.params.cardNo],
	function(err, rows){
		if (err){
			console.log('Error fetching for check-in Verification'+err);	
			return;
		}
		if(rows[0].dueBooks > 0)
			res.send('The Card holder has to return all the books\n which are due before paying!');
		else		
			res.send('No due books');
	});
	console.log('checkinVerification successful');
});

//UPDATE ALL THE BOOKS AS CHECKED-IN AND FINE STATUS AS PAID
app.post('/updateCheckinPaidStatus', function(req, res){
	con.query('update book_loans set date_in = curDate() where card_no = ? and date_in is NULL', [req.body.card_no],
	function(err, rows){
		if (err){
			console.log('Error fetching for update check-in, paid fine Status'+err);	
			return;
		}
		console.log('updateCheckinPaidStatus successful');
	});
	con.query('update FINES set paid = true where loan_id in (select loan_id from book_loans where card_no = ? and date_in is NOT NULL)', 		[req.body.card_no],
	function(err, rows){
		if (err){
			console.log('Error fetching for update check-in, paid fine Status'+err);	
			return;
		} else{
			res.send('Status updated as Paid');
		}
	});
});

//con.end(function(err) {});
app.listen(3000);
console.log("Server running in port 3000");
