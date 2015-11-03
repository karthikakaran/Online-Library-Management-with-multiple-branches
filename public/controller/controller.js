var libApp = angular.module('libApp', ['ngRoute']);
libApp.config(['$routeProvider',function($routeProvider) {
        $routeProvider
            .when('/checkOutBooks', {
                templateUrl : 'checkOutBooks.html',
                controller  : 'checkOutController'
            })
	    .when('/checkInBooks', {
                templateUrl : 'checkInBooks.html',
                controller  : 'checkInController'
            })
	    .when('/addMember', {
                templateUrl : 'addMember.html',
                controller  : 'addBorrowerController'
            })
	    .when('/fineDetails', {
                templateUrl : 'fineDetails.html',
                controller  : 'fineDetailsController'
            })
	    .otherwise({
                redirectTo: '/'
            });
}]);

libApp.controller('mainController', function($scope, $http, $window, $location) {
   $scope.addNewBorrower = function(){
	$location.path('addMember');
   };
   $scope.checkOutBooks = function(){
	$location.path('checkOutBooks');
   };
   $scope.checkInBooks = function(){
	$location.path('checkInBooks');
   };
   $scope.fineDetails = function(){
	$location.path('fineDetails');
   };
});

libApp.controller('checkOutController', function($scope, $http, $window, $location) {
   $scope.bookList = [];
   var vIndex = 0;
   var vTitle = '[a-z]'; var vBook_id = '[a-z0-9]'; var vAuthorFname = '[a-z]'; var vAuthorLname = '[a-z]';
   $scope.enableCheckOutBtn = true;
   document.getElementById("txt_book_id").focus();

   // on click of Add button
   $scope.searchBooksFunction = function(){
	$scope.bookList = [];
	vTitle = '[a-z]'; vBook_id = '[a-z0-9]'; vAuthorFname = '[a-z]'; vAuthorLname = '[a-z]';
		
	if (($scope.title == undefined || $scope.title.length == 0) && ($scope.book_id == undefined || $scope.book_id.length == 0) && ($scope.authorFname == undefined || $scope.authorFname.length == 0) && ($scope.authorLname == undefined || $scope.authorLname.length == 0 ))
		alert("Enter a value to search");
	else{
	   if ($scope.title != undefined && $scope.title.length != 0)
		 vTitle = $scope.title;
	   if ($scope.book_id != undefined && $scope.book_id.length != 0)
		 vBook_id = $scope.book_id;
	   if ($scope.authorFname != undefined && $scope.authorFname.length != 0)
		 vAuthorFname = $scope.authorFname; 
	   if ($scope.authorLname != undefined && $scope.authorLname.length != 0)
		 vAuthorLname = $scope.authorLname;
	   $http.get('/bookList/' + vBook_id + '/' + vTitle + '/' + vAuthorFname + '/' + vAuthorLname).success(function(response){	       
		if (typeof response == "string")
			alert(response);
		else
       	    		$scope.bookList = response;
	    });
	}    
    };
    $scope.CheckedOutIndexFunction = function(index){
	//if (check_books){
	    vIndex = index;
	    $scope.bookSelected = {'book_id': $scope.bookList[index].book_id, 'branch_id': $scope.bookList[index].branch_id, 					   'card_no': $scope.card_no};
	    $scope.enableCheckOutBtn = false;
	//}
    };
    $scope.CheckOutBooksFunction = function(){
	if($scope.card_no == undefined || $scope.card_no == null){
          $scope.card_no = prompt("Please enter your card no");
	}
	if($scope.bookSelected == undefined){
	   alert('Select a book to check out');
	}else if ($scope.bookSelected != undefined){
	    $scope.bookSelected['card_no'] = $scope.card_no;
	    if($scope.bookList[vIndex].r_copies == 0){
		alert("No stock remaining in this branch\nPlease check out from another branch!");
	    } else {
		$http.post('/bookList', $scope.bookSelected).success(function(response){	       			        
			alert(response);
			if(response.indexOf(" is checked out") != -1){
				$scope.bookList[vIndex].r_copies = Math.max(0,$scope.bookList[vIndex].r_copies - 1);
				$scope.enableCheckOutBtn = true;
				$scope.booksCheckedout = false;
			}
			/*$http.get('/bookList/' + vBook_id +'/'+ vTitle +'/'+ vAuthorFname +'/'+ vAuthorLname).success(function(response){	       			        if (typeof response == "string")
					alert(response);
				else
	       	    			$scope.bookList = response;  
			});*/
			$scope.card_no = undefined;
			//$scope.enableCheckOutBtn = true;
			//$scope.booksCheckedout = false;
	    	});
	   }
        }
    };
});

libApp.controller('checkInController', function($scope, $http) {
	$scope.enableCheckInBtn = true;
	document.getElementById("txt_card_no").focus();
	var vCard_no = '0'; var vBook_id = '[a-z0-9]'; var vFname = '[a-z]'; var vLname = '[a-z]';

	//on click of search button
	$scope.searchBookLoanFunction = function(){
		$scope.bookLoanList = [];
		vCard_no = '0'; vBook_id = '[a-z0-9]'; vFname = '[a-z]'; vLname = '[a-z]';
	
		if (($scope.card_no == undefined || $scope.card_no.length == 0) && ($scope.book_id == undefined || $scope.book_id.length == 0) 				&& ($scope.fname == undefined || $scope.fname.length == 0) && ($scope.lname == undefined || $scope.lname.length == 0 ))
			alert("Enter a value to search");
		else{
		   if ($scope.card_no != undefined && $scope.card_no.length != 0)
			 vCard_no = $scope.card_no;
		   if ($scope.book_id != undefined && $scope.book_id.length != 0)
			 vBook_id = $scope.book_id;
		   if ($scope.fname != undefined && $scope.fname.length != 0)
			 vFname = $scope.fname; 
		   if ($scope.lname != undefined && $scope.lname.length != 0)
			 vLname = $scope.lname;   		  
		   $http.get('/bookLoanList/' + vCard_no +'/'+ vBook_id +'/'+ vFname +'/'+ vLname).success(function(response){	       
			if (typeof response == "string")
				alert(response);
			else
				$scope.bookLoanList = response;
		   });
		}
	};
	$scope.CheckedInIndexFunction = function(index){	
		//if (check_books){
	    		$scope.bookLoanSelected = {'index': index, 'book_id': $scope.bookLoanList[index].book_id, 'branch_id': 					$scope.bookLoanList[index].branch_id, 'loan_id': $scope.bookLoanList[index].loan_id};
			$scope.enableCheckInBtn = false;
		//}
   	};
	$scope.CheckInBooksFunction = function(){
		if($scope.bookLoanSelected == undefined){
		   alert('Select a book to check in');	
		}else if ($scope.bookLoanSelected != undefined){
		    $http.post('/bookLoanCheckIn', $scope.bookLoanSelected).success(function(response){	       			        
			alert(response);
			var ind = $scope.bookLoanSelected['index'];
 			$http.get('/bookLoanList/' + vCard_no +'/'+ vBook_id +'/'+ vFname +'/'+ vLname).success(function(response){	       			       		if (typeof response != "string")      	    		
					$scope.bookLoanList = response;
				else
					$scope.bookLoanList = [];
		   	});
			$scope.enableCheckInBtn = true;
		    });
		}
	};
});

libApp.controller('addBorrowerController', function($scope, $http) {
     $scope.enableAddMemberBtn = false;
     var phoneNo = null;
     document.getElementById("txt_Fname").focus();
     $scope.addBorrowerDetails = function(){
	if (!$scope.memberForm.$valid) {
        	alert('Fill enter form');
        }else {
		$scope.enableAddMemberBtn = false;
		if (!$scope.memberForm.phone.$pristine)
			phoneNo = $scope.phone;
     		$scope.borrowerDetails = JSON.stringify({'fname': $scope.fname, 'lname': $scope.lname, 'email': $scope.email, 'address': 				 		$scope.address, 'phone': phoneNo});
		$http.post('/borrowerDetails', $scope.borrowerDetails).success(function(response){	       			        
	      		alert(response);
			$scope.enableAddMemberBtn = true; 
     		});
       }	
     };
});

libApp.controller('fineDetailsController', function($scope, $http) {
	$scope.totalAmt = 0;
	$scope.finesUpdateFunction = function(){
		$http.post('/refreshFines').success(function(response){	       			        
	      		alert(response); 
     		});
	};
	$scope.finesFetchFunction = function(){
		$scope.totalAmt = 0;		
		$scope.fineDetails = [];
		
		//Fetch total fine amount
		$http.get('/fetchTotalFineAmt/' + $scope.card_no).success(function(response){
			if (typeof response == "string")
				alert(response);
			else	        
	      			$scope.totalAmt = response;
			//Fetch fines
			if (typeof response != "string" && $scope.totalAmt > 0){
				$http.get('/fetchFines/' + $scope.card_no).success(function(response){	       			        
					if (typeof response != "string")    			        
			      			$scope.fineDetails = response;
		     		});
			} else if (typeof response != "string" && $scope.totalAmt <= 0){
				alert('The card holder borrowered books but does not have any fines');
			}
		});		
	};
	$scope.totalFinePayFunction = function(){
		$http.get('/checkinVerification/' + $scope.card_no).success(function(response){
			if (response.indexOf("No due books") == -1){
				alert(response);
				var yesNo = confirm('Can I check-in all books?\nAll books are returned?');
				if (yesNo)
					$scope.checkInUpdateFunction();
			
			} else {  
				 alert(response);
				 $scope.checkInUpdateFunction();
			}
     		});
	};
	$scope.checkInUpdateFunction = function(){
		$http.post('/updateCheckinPaidStatus', {'card_no' : $scope.card_no}).success(function(response){
			alert(response);
			$scope.fineDetails = []; 
			$scope.totalAmt = 0;
		});
	};
});
