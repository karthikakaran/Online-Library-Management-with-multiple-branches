# LibraryProject
Technologies used: AngularJS, NodeJS, HTML5, CSS, Bootstrap, MySQL
Quick Start user guide for librarian system users

There are 5 flows:
1. Add new borrower
2. Search for the books in the library branches
3. Check-Out books
4. Check-In books
5. Fines for the book loaned

1. Add new borrower:
	i. Click the Add New Borrower tab
	ii. Enter the mandatory fields/details like firstName, lastName, email address, address, phone
	iii. Add Member button will be enabled after entering valid values
	iv. On clicking it, the borrower will be added with a new card no and a message "New borrower added" appears
	v. If duplicate the entry is made, it will prompt for a different entry/ reject the duplicate entry by a message

2. Search for the books in the library branches:
	i. Click the Check Out Books tab
	ii. Enter the book id or title or author(s) name and click Search button
	iii. The books matched will be displayed
	iv. If no book matches, it shows a message "No book found for this criteria"

3. Check-Out books:
	i. Click the Check Out Books tab
	ii. Enter the book id or title or author(s) name and click Search button
	iii. The books matched will be displayed, If no book matches, it shows a message "No book found for this criteria"
	iv. Select one book, enter the card no of the borrower and click the Check-Out button
	v. If the card_no is not entered, then a prompt will pop-up to enter the card_no when the Check-Out button is clicked
	vi. After selecting the book to be checked out and the card no, the message "Book is checked out" appears
	vii. The user can see the reduction in the no of copies left(stock) in the library branch from where the book is checked out as an 	        indication
	viii. If the user had already checked out 3 books, then the system will reject the new check out with a message

4. Check-In books:
	i. Click the Check In Books tab
	ii. Enter the card no or book id or any part of borrower name and click Search button
	iii. The books matched will be displayed, If no book matches, it shows a message "No book found for this criteria"
	iv. Select the book to be checked in and click the Check-In button
	v. The message "The book is checked in appears"
	vi. The checked in book disappears from the list indicating that it is checked in  




5. Fines for the books loaned:
	i. Click the Fine Details tab
	ii. The fine amounts for each book loaned but not returned by the due date can be 	updated/refreshed everyday or whenever required by clicking the “Refresh” image in the fine page
	iii. If all the fine details of a borrower or card no is required, then enter the card no in the text box and click the “Fetch Fines” button
	iv.  The list of books from the database with the branch ids, due dates and fine amounts will be displayed
	v. Also the “Total fine amount” to be paid by the borrower will be displayed
	vi. Then the librarian can click the “Pay” button to update the database after the borrower pays the total fine amount
	vii.  But the payment cannot be made unless until all the books that are due to be returned or has a fine listed in the page are returned to the librarian
	viii. So the librarian clicks on the  “Pay”  button before checking in the book through “Check-In books”, a message “The book is not yet checked-in” will be prompted
	ix. So the librarian should manually ask for the books to be returned, check it in(update it in database) and proceed with fine payment



Design Justiication:

•	The Search and Check Out module is designed together as to facilitate the Check-out after searching, otherwise it would be an extra work or performance overhead to do the search/fetch opertations twice

•	This also facilitates the librarian to just Search without doing a Check-out operation

•	The requirement says “The multiple copies at different branch locations should display on separate lines, to facilitate location-specific checkout”, which means the user can checkout from the search list based on the branch id which he prefers, rather than entering book_id, branch_id (where only 1 item will be displayed) and if the stock is not available in one branch, then again the data should be entered for check-out



  




























Software libraries and dependencies and its versions

Technologies used: HTML5, CSS, AngularJS, NodeJS, Express, MySQL db, gedit as text editor

1.For GUI/Front-end:

AngularJS library from CDN link: (version 1.3.14, 1.2.25)
http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js
AngularJS Routing library from CDN link:
http://ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular-route.js

Bootstrap library for style from CDN link: (version 3.3.5)
https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css
https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css

2.For Database/Back-end: MySQL server (Version 5.5.44, for debian-linux-gnu (i686))

3.For Webserver: NodeJS (version v0.12.7), npm modules: (version 2.11.3) Express, MySQL, body-parser


Running Instructions
 
 1. In the terminal/cmd prompt, navigate to the project folder where server.js(node server code file) is present
 2. Type node server, the server will start locally
 3. Open any browser, type the URL https://localhost:3000 (3000 is the port the server is listening to)
4. The app starts working








