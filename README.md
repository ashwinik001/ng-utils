# ng-utils
###### Daily use angular filters / directives

### **form.input.formatter**

###### The directive purpose is to support the scenarios where we need to have different containment in the input-tag and the value stored against the model.
    
##### Usage Syntax:

*	Dependency Registration
    
```javascript
var module = ng.module('your-module-name', ['form.input.formatter']);
```

*	In HTML-Template *(Either of the following)*

```html
<input input-formatter="number" type="text" ng-model="your-model"/>
<input input-formatter="number:3" type="text" ng-model="your-model"/>
<input input-formatter="currency" type="text" ng-model="your-model"/>
<input input-formatter="currency:£" type="text" ng-model="your-model"/>
<input input-formatter="currency:$:2" type="text" ng-model="your-model"/>
<input input-formatter="percentage:%" type="text" ng-model="your-model"/>
<input input-formatter="percentage:#:2" type="text" ng-model="your-model"/>
```

The following will throw the error saying
"Seems you have passed a number '3' as a prefix/suffix for showing in the view for formatting." --- Cool 'Ehh...' ;-)
<input input-formatter="percentage:3:%" type="text" ng-model="your-model"/>

As per the convention I am prepending the currency symbol and appending the percentage symbol.

*	Existing Minor Issues
    
	1.	The `,` can not be deleted manually inside the input box -- Which is fine for the formatted number
	2.	Currently only `percentage`, `number` and `currency` filters are supported.
	3.	...






/**
 * Created by ashwinikumar on 23/07/15.
 * The directive purpose is to support the scenarios where we need to have different c
 * ontainment in the input-tag and the value stored against the model.
 * Usage:
 *		Dependency Registration
 *			var module = ng.module('your-module-name', ['form.input.formatter']);
 *		In HTML-Template (Either of the following)
 *			<input input-formatter="number" type="text" ng-model="your-model"/>
 *			<input input-formatter="number:3" type="text" ng-model="your-model"/>
 *			<input input-formatter="currency" type="text" ng-model="your-model"/>
 *			<input input-formatter="currency:£" type="text" ng-model="your-model"/>
 *			<input input-formatter="currency:$:2" type="text" ng-model="your-model"/>
 *			<input input-formatter="percentage:%" type="text" ng-model="your-model"/>
 *			<input input-formatter="percentage:#:2" type="text" ng-model="your-model"/>
 *
 *			This will throw the error saying
 *			"Seems you have passed a number '3' as a prefix/suffix for showing in the view for formatting."
 *			--- Cool 'Ehh...' ;-)
 *			<input input-formatter="percentage:3:%" type="text" ng-model="your-model"/>
 *
 * 	As per the convention I am prepending the currency symbol and appending the percentage symbol.
 *
 *	Existing Minor Issues
 *		The `,` can not be deleted manually inside the input box -- Which is fine for the formatted number
 *		Currently only `percentage`, `number` and `currency` filters are supported.
 *
 *
 *
 */