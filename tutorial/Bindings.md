Bindings
======

Equals '=':
-----------
The most basic of them, it should work exactly the same as in angular. It covers the 3 basic cases:
 - Parent changes, child gets parent value.
 - Child changes, parent gets child value.
 - Parent and child change, child gets parent value.

At '@':
----------
This one also pretty basic, it only accepts strings, and can come in two forms:
- Regular string such as 'TRANSLATION.KEY',  which will be assigned (but not watched) to the controller as a string
- Expression string such as '{{myVar}}' which will be watched (and also bound in construction time) have in mind this comes from the parent scope, thats why its only myVar and not ctrl.myVar

Expression '&':
---------------
This one is the most complicated of them, mostly because is the hardest to emulate.
It accepts three types of configurations.

- String: it will get executed in the parent scope, and the locals can be provided inside the controller, as in angular. Have in mind the parent controller probably won't have a controller, so accesing functions or properties should be of the type 'someProperty' or 'aFunction(localParameter)', but as you would expect, you can also do 'aFunction(aProperty, localParameter)', where aProperty belongs to the parent as well as the function, but localParameter is provided by the child controller in the actual function call.
- Function: It will try to get the function arguments, and with that create a expression similar to the string, this is really usefull for perhaps spies and things like that, but it has the limitation of not being able to use parameters like 'property.childProperty', since is not a valid variable name.

	A valid function would be,
	
	```javascript
    function (parameterA, parameterB){
		//some code
	}
     ```
     
	 Which could be 'translated' to 'aFunction(parameterA, parameterB)', have in mind, if parameterA or parameterB match the parent, it can be used as the aProperty example from above.
- Object: this one takes sort of the form of injections in angular, more specifically, the $inject array that annotate creates. It should have 2 properties, 'injections' and 'fn' (we might want to change that). 'fn' is the function to be called, and 'injections' should be a dictionary, where the key is the name of the function argument, and the value is a string representing a context variable for the parser, for example,
    ```javascript
  	const fnObj = {
    	injections: {
          a: 'firstArgument',
          b: 'secondArgument',
          c: '"aStringConstant"' // this could be also 'true', or '100' which will be passed as boolean and number
      },
      fn: function (a, b, c) {
          if (c === fnObj) {
              return fnRef(a, b);
          }
          throw 'invalid argument';
      }      
  	};
	```
	which could be translated to 'aFunction(firstArgument, secondArgument, expressionObject)' where any of the object can belong to the parent scope or the locals