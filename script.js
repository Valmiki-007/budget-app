
var budgetcontroller = (function(){

     var Expense = function (id,description,value) {
         this.id=id;
         this.description=description;
         this.value=value;
         this.percentage=-1;
     };

     Expense.prototype.calcPercentage = function(totalIncome) {           // this thoery is taught in advance javascript objects
        if (totalIncome > 0) {                                            // refer to copy for notes
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

     var Income = function (id,description,value) {
        this.id=id;
        this.description=description;
        this.value=value;
    };

       var calculatetotal = function(type){               // we made a function in which if we pass exp or inc it will accordingly
           var sum=0;                                     // return sum of all values present at each index of exp or inc and then
           data.allItems[type].forEach(function(curr){    // we also stored it in totals inc or exp (if we received type as inc we stored
               sum=sum+curr.value;                        // in data.totals[inc])
           });
           data.totals[type]=sum;
       };


     var data = {
         allItems:{
             exp:[],
             inc:[]
         },

         totals:{
             exp:0,
             inc:0
         },
         budget:0,
         percentage:-1,
     };

    return {
        addItem: function(type, des, val){
            var newItem, ID;
            
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1
            
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteitem : function(type,id){
           var ids,index;

            // if our id is 6 then doesnt mean that we need to delete item at 6th index bcz it might be possible
            // that numbering of index isnt in contionous order like , ids = [1 2 4  8] 
            // so we made an array of our current index then seacrhed for index of id we are looking for

            // id = 6         if our id is 6 then as per observation index of 6 is 3 so we should go to index 3 and perform our work
            //                but if we simply confuse id as index then we will end up at index 6 which is 10 and we dont want to work on that

            //data.allItems[type][id];
            // ids = [1 2 4 6 8 10 12 15 17]     // now we have array of id stored in ids ,so we will look for index of 6 and then get ans 
            //                                   as 3 then go to 3rd index and do work

            //index = 3

           ids = data.allItems[type].map(function(current){       // brings us the array of index
                 return current.id;
           });

           index =ids.indexOf(id);    // looked for index of id in ids array
            if(index!=-1)
            {
                data.allItems[type].splice(index,1);
            }

        },

       calculatebudget : function(){
           // calculate total income and expenses

                calculatetotal('exp');                // above we have already made a function calculate total which requires type
                calculatetotal('inc');                // so we once we passed inc , 2nd time passed exp so now we have calculated 
                                                      // our total income and expenses and its stored in data.totals[exp] and data.totals[inc]
    

           // calculate the budget:income expenses
            data.budget=data.totals.inc - data.totals.exp;   // here we calculated the diff between income and expenses
           //calculate the % of income that we spent
           if(data.totals.inc>0)
           {
            data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);  // calculated % and taken only integer value
           }
           else
           {
               data.percentage= -1;
           }
              
       },

       calcPercentage:function(){

        data.allItems.exp.forEach(function(cur) {
            cur.calcPercentage(data.totals.inc);
         });
       },

       getPercentages: function() {
        var allPerc = data.allItems.exp.map(function(cur) {
            return cur.getPercentage();
        });
        return allPerc;      // its an array with all percentages
    },

       getbudget: function(){
           return {
               budget :data.budget,        // made this so that we can pass all calculated value to uictrl
               income:data.totals.inc,
               expenses: data.totals.exp,
               percentage: data.percentage,
           };
       },


        testing: function() {
            console.log(data);
        }
           
    };
    // // some codes later on

})();

var UIcontroller = (function(){
    var DOMstrings={
        type :'.add__type',
        description :'.add__description',        // we made a object name as DOMstrings and in that we stored button class
        value :'.add__value', 
        budget:'.budget__value',
        incval:'.budget__income--value',
        expval:'.budget__expenses--value',
        percentage:'.budget__expenses--percentage',
        container:'.container',
        inputbtn : '.add__btn',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
        incomecontainer:'.income__list',
        expensecontainer:'.expenses__list',       // purpose of doing this was in case we need to change our button class name
    };                                          // we can directly come and just update DOMstrings we dont need to do change in
                                                // whole of code bcz everywhere else we will use DOMstrings.


     var formatNumber = function(num, type) {
            var numSplit, int, dec, type;
            /*
                + or - before number
                exactly 2 decimal points
                comma separating the thousands
                2310.4567 -> + 2,310.46
                2000 -> + 2,000.00
                */
    
            num = Math.abs(num);   // by this we removed any sign that number has and only stored absolute part
            num = num.toFixed(2);  // it will take only 2 decimal thats what we want but it converts our num to string
    
            numSplit = num.split('.');  // numsplit is an array in which at 0th index we have integer value and at 1st index we have decimal
                                        // for e.g if num = 1253.12, numsplit[]={1253,12};
    
            int = numSplit[0];      // we are storing integer part of numsplit in int
            if (int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
            }
    
            dec = numSplit[1];
    
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    
        };
        
      



    return{
        getInput : function()
        {
            return{
                type        :document.querySelector(DOMstrings.type).value,
                description :document.querySelector(DOMstrings.description).value,         //this will return type,description and value 
                value       :parseFloat(document.querySelector(DOMstrings.value).value),   // given by user ,bu default its stored as
                                                                                           // string but we want to store it as integer
                                                                                           // so we wrote parsefloat before that ,this function convert string into and an integer
            };
        },

        addlistitem: function(obj,type){
            var html,newhtml,element;

            // create html string with placeholder text
            if(type==='inc')
            {
                element=DOMstrings.incomecontainer;
              html ='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
            }
            else if(type==='exp')
            {
                element=DOMstrings.expensecontainer;
              html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace the placeholder text with some actual data
            newhtml=html.replace('%id%',obj.id);
            newhtml=newhtml.replace('%description%',obj.description);
            newhtml=newhtml.replace('%value%',formatNumber(obj.value,type));

            // Insert the HTML into DOM

            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);  // there are different places where we can insert
                                                                                      // our HTML beforehand is one type ,we can read about it 
                                                                                      // in mdn docs.
            
        },
        deleteListItem: function(selectorID) {
                                                           // in javascript we cannot delete an element we can only delete a child
            var el = document.getElementById(selectorID);  // so we first selected parent of that element and then called delete on child
            el.parentNode.removeChild(el);
            
        },

        clearfield:function(){
            var field,fieldArr;
             // we are now going to use queryselectorall for clearing  description and values ,and we enter arguments in
             // querySelectorAll just as we do in css ,i.e. by giving comma
             // querySelectorAll will now return a list to field ,and we have converted that list to array because its easier
             // to do things in array
            field=document.querySelectorAll(DOMstrings.description + ',' + DOMstrings.value);
            fieldArr=Array.prototype.slice.call(field);  // converted list which was stored in field to array which is now
                                                         // stored in fieldArr

            fieldArr.forEach(function(current,index,array){  // we iterate over each of fieldArr and then 
             current.value="";                               // set all the values to "" i.e empty 
            });

            fieldArr[0].focus();                            // after we have done entering and saving then cursor
                                                            // will now point to description box 
        },

        displaybudget : function(obj){
           var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budget).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incval).textContent=formatNumber(obj.income,'inc');
            document.querySelector(DOMstrings.expval).textContent=formatNumber(obj.expenses,'exp');

            if(obj.percentage>0)
            {
               document.querySelector(DOMstrings.percentage).textContent=obj.percentage + '%';
            }
            else
            {
                document.querySelector(DOMstrings.percentage).textContent='----';
            } 
        },

        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);  // document.querySelectorAll(DOMstrings.expensesPercLabel)
                                                                                   // returns a node list which we then store in fields
                                                                                   // now we need to change textcontent for each of them
                                                                                   // but nodelist doesnt have foreach method so we made call
                                                                                   //back function and did some calculation for displaying percentages
           
          var nodeListForEach = function(list, fn) {
               for (var i = 0; i < list.length; i++) {
               fn(list[i], i);
               }
             };                                                                 
            function cp(current, index)
            {
                
                if (percentages[index] > 0) 
                {
                    current.textContent = percentages[index] + '%';
                } 
                else 
                {
                    current.textContent = '---';
               }
            };
            

            nodeListForEach(fields,cp);   
        },

        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstrings.type + ',' +
                DOMstrings.description + ',' +
                DOMstrings.value);

                var nodeListForEach = function(list, fn) {
                    for (var i = 0; i < list.length; i++) {
                        fn(list[i], i);
                    }
                };
                function ctype(cur)
                {
                    cur.classList.toggle('red-focus'); 
                 };

                nodeListForEach(fields, ctype); 
            
            document.querySelector(DOMstrings.inputbtn).classList.toggle('red');
            
        },


        displayMonth: function() {
            var now, months, month, year;
            
            now = new Date();  // in now we have stored current date
            //var christmas = new Date(2016, 11, 25);
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth(); // this will number for each monh like for january 0 ,feb 1,march 2....
            
            year = now.getFullYear(); // this will store year
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

         


        getDOM:function()
        {
            return DOMstrings;               // this will return dom strings 
        }
    };
  
})();


var controller = (function(budgetctrl,UIctrl)
{
     



        var setupeventlisteners = function ()
    {           
             var DOM = UIctrl.getDOM();     // we need to get dom strings that we made in ui controller to use in this module
                                            // so this line of code
            
     document.querySelector(DOM.inputbtn).addEventListener('click',additem); 
     
     document.addEventListener('keypress',function(e)
       {
           if(e.keyCode==13)                         // Idea is that whenever someone presses enter key in our webpage we will
           {                                         // call this function ,so whenever someone presses any key for that we have used
                                                     // keypress and now when any key is pressed we will call function which has
              additem();                             // argument as the key that was pressed, every key that was pressed has a certain
           }                                         // keycode we can look for that on google and also if we do console.log(e)
                                                     // so for enter button keycode is 13 and with if loop we checked that if keycode
       });                                            // is 13 then we need to add item so call that function.                             
            
       document.querySelector(DOM.container).addEventListener('click',deleteitem);
       document.querySelector(DOM.type).addEventListener('change',UIctrl.changedType);
    };


       
        var updatebudget = function(){
            
          //    1. Calculate the budget
                 budgetctrl.calculatebudget();
          //    2. Return the budget
                 var budget = budgetctrl.getbudget();

          //    3. Display the budget on the UI
               UIctrl.displaybudget(budget);
        };

        var updateper =function(){
             // 1.Calculate the percentage

                budgetctrl.calcPercentage();

             // 2.Read percentage from budget controller

              var percentage = budgetctrl.getPercentages();

             // 3.Update the UI with new percentage
                
                UIctrl.displayPercentages(percentage);
        };
       

        var additem = function()
        {
            var input,newitem;
             //    1. Get input data from user
            input=UIctrl.getInput();
             
            //Now we want to make sure that we dont make entries if description is blank or input value is blank,input value  should be >0
            // so we wrote everything inside if statements 
            if(input.description!="" && !isNaN(input.value) && input.value>0)
             {

            //    2. Add input data to budget controller
            newitem = budgetctrl.addItem(input.type,input.description,input.value);
            
            //    3. Add the item to UI

            UIctrl.addlistitem(newitem,input.type);

            // 4.Clear the fields
               
            UIctrl.clearfield();
             }
           
           //5. Calculating and updating budget
           updatebudget();

           // 6. updating percenateg

           updateper();

        };

        var deleteitem =function(e){
            var itemid ,splitid,type,ID;

         itemid = e.target.parentNode.parentNode.parentNode.parentNode.id;  // Here we have stored parent class id in itemid ,
                                                                            // more explanation in HTML section (about parent node)

         if(itemid)
         {
           splitid=itemid.split('-');                         // item id contains "item-0" or "item-1" or "item-n" so we need 2 info
           type=splitid[0];                                   // from here type , whether its inc or exp and id so we stored inc or exp
           ID=parseInt(splitid[1]);                           // in type and id in id with split method of string ,we also need to take 
                                                              // care that slitid has string elements so in id we firstly converted string
                                                              // to an int then stored it
           // 1. Delete the item from Data structure
              budgetctrl.deleteitem(type,ID);
           // 2.Delete the item from UI
                
              UIctrl.deleteListItem(itemid);

           // 3. Update and show the new budget
           updatebudget();

           // 4. updating percenateg

           updateper();

         }

        }
   
        return {
            init: function() {
                console.log('Application has started.');
                UIctrl.displayMonth();
                UIctrl.displaybudget({
                    budget :0,        // made this so that we can initialse everything to 0 in beginning
                    income:0,
                    expenses: 0,
                    percentage: 0,
                });
                setupeventlisteners();
            }
        };


})(budgetcontroller,UIcontroller);
controller.init();
