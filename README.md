# ng-utils
###### Daily use angular directives

#### **form.input.formatter**

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
```

*	Limitations
    
	1.	Currently only `number` and `currency` filters are supported.
	2.	...

#### **TBD**
