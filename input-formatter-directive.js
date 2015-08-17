/**
 * Created by ashwinikumar on 23/07/15.
 * The directive purpose is to support the scenarios where we need to have different containment in the input-tag and the value stored against the model.
 * Usage:
 * 		Dependency Registration
 * 			var module = ng.module('your-module-name', ['form.input.formatter']);
 * 		In HTML-Template (Either of the following)
 * 			<input input-formatter="number" type="text" ng-model="your-model"/>
 * 			<input input-formatter="number:3" type="text" ng-model="your-model"/>
 * 			<input input-formatter="currency" type="text" ng-model="your-model"/>
 * 			<input input-formatter="currency:£" type="text" ng-model="your-model"/>
 * 			<input input-formatter="currency:$:2" type="text" ng-model="your-model"/>
 *
 * 	Existing Minor Issues
 * 		The `,` can not be deleted manually inside the input box -- Which is fine perhaps
 * 		Currently only `number` and `currency` filters are supported.
 *
 */

!(function (ng) {
	'use strict';

	var customRender = function (el, prevVal, newVal, ngModelCtrl, setCursor) {

		var start = el.selectionStart;
		var end = el.selectionEnd + newVal.length - prevVal.length;

		ngModelCtrl.$setViewValue(newVal);
		ngModelCtrl.$render();

		//if (setCursor)
		el.setSelectionRange(end, end);
	};

	ng.module('form.input.formatter', []).directive('inputFormatter', ['$filter', function ($filter) {

		return {
			require: 'ngModel',
			restrict: 'A',
			link: function ($scope, $iElement, $iAttrs, ngModelCtrl) {

				var inputFormatterAttrs = $iAttrs.inputFormatter.split(':'),
					filterName, regEx,
					el = $iElement[0],
					firstParam, secondParam, precisionParam;

				if (inputFormatterAttrs.length === 0) {
					return;
				}

				filterName = inputFormatterAttrs[0];
				firstParam = inputFormatterAttrs[1];
				secondParam = inputFormatterAttrs[2];

				if (filterName === 'number') {
					precisionParam = parseInt(firstParam);
				} else if (filterName === 'currency') {
					precisionParam = parseInt(secondParam);
				}

				if (precisionParam === precisionParam && precisionParam !== 0) {
					//precision param provided is a good integer and it is not zero
					//That case we should scrap all non-digit integers and we should not scrap the last decimal point
					regEx = /[^0-9.]|\.(?=.*\.)/g;
				} else {
					//precision param provided implied is zero
					//That case we should scrap all non-digit integers (including dots/decimals)
					regEx = /[^0-9]/g;
				}

				ngModelCtrl.$parsers.push(function toModel(viewValue) {

					var modelValue = $filter(inputFormatterAttrs[0])(viewValue.toString().replace(regEx, ''), firstParam, secondParam);

					if (modelValue === viewValue) {
						return modelValue;
					}

					//customRender(el, viewValue, modelValue, ngModelCtrl, true);
					customRender(el, viewValue, modelValue, ngModelCtrl);

					modelValue = modelValue.replace(regEx, '');

					return modelValue;
				});

				ngModelCtrl.$formatters.push(function toView(modelValue) {

					//Let's handle the cases
					//	1. where database has the data in a different format than what we intend to save in the model or view-value
					// like database may store the value as 3423.89 or 3423.00 whereas the front-end model should be 3423 and view value should be 3,423

					if (precisionParam === precisionParam && precisionParam !== 0) {
						modelValue = parseFloat(modelValue);
					} else {
						modelValue = parseInt(modelValue);
					}

					//	2.	taking care of integers
					modelValue = modelValue ? modelValue.toString() : '';

					var viewValue = $filter(inputFormatterAttrs[0])(modelValue.replace(regEx, ''), firstParam, secondParam);

					//customRender(el, viewValue, modelValue, ngModelCtrl);

					return viewValue;
				});
			}
		};
	}]);
})(angular);
