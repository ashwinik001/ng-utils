/**
 * Created by ashwinikumar<kumarashwini@outlook.com>
 *     on 23/07/15.
 */

(function (ng) {
	'use strict';

	var NUMBER_DIRECTIVE_NAME = 'number',
		CURRENCY_DIRECTIVE_NAME = 'currency',
		PERCENTAGE_DIRECTIVE_NAME = 'percentage',
		customRender = function (el, oldViewVal, newViewVal, ngModelCtrl, setCursor) {

			var start = el.selectionStart;
			var end = el.selectionEnd + newViewVal.length - oldViewVal.length;

			ngModelCtrl.$setViewValue(newViewVal);
			ngModelCtrl.$render();

			//if (setCursor)
			el.setSelectionRange(end, end);
		};

	ng.module('form.input.formatter', [])
		.filter('percentage', ['$window', '$filter', function ($window, $filter) {
			return function (sample, appender, precision) {
				if ((sample !== 0 && !sample) || (sample !== sample)) {
					return '';
				}

				appender = appender || '%';

				precision = ((precision || precision === 0) && isFinite(precision)) ? precision : 0;

				return $filter('number')(sample, precision) + ' ' + appender;
			};
		}])
		.directive('inputFormatter', ['$filter', function ($filter) {

			return {
				require: 'ngModel',
				restrict: 'A',
				scope: true,
				link: function ($scope, $iElement, $iAttrs, ngModelCtrl) {

					var inputFormatterAttrs = $iAttrs.inputFormatter.split(':'),
						filterName, viewCleanerRegex,
						el = $iElement[0],
						firstParam, secondParam, precisionParam, formatterParam;

					if (inputFormatterAttrs.length === 0) {
						return;
					}

					filterName = inputFormatterAttrs[0];
					firstParam = inputFormatterAttrs[1];
					secondParam = inputFormatterAttrs[2];

					if (filterName === NUMBER_DIRECTIVE_NAME) {
						precisionParam = parseInt(firstParam);
					} else if (filterName === CURRENCY_DIRECTIVE_NAME || filterName === PERCENTAGE_DIRECTIVE_NAME) {
						precisionParam = parseInt(secondParam);
						formatterParam = firstParam;
					} else {
						return;
					}

					if(precisionParam !== precisionParam) {
						precisionParam = 0;
					}

					if (precisionParam > 0) {
						//we should scrap all non-digit integers
						// and we should not scrap the last decimal point
						viewCleanerRegex = /[^0-9.]|\.(?=.*\.)/g;
					} else {
						//precision param provided implied is zero/negative
						//That case we should scrap all non-digit integers (including dots/decimals)
						viewCleanerRegex = /[^0-9]/g;
					}

					//Testing, if the user by mistake reverses the directive arguments
					//Like user paseed 'currency:2:$' in stead of 'currency:$:2'
					if (isFinite(formatterParam)) {
						throw new Error('Seems you have passed a number \'' + formatterParam +
							'\' as a prefix/suffix for showing in the view for formatting.');
					}

					ngModelCtrl.$parsers.push(function toModel(inputViewVal) {

						var cleanViewVal = inputViewVal.toString().replace(viewCleanerRegex, ''),
							modelValue, formattedInputViewVal,
							userFedPrecision,
							userEnteredPrecisionIncludingDot = 0, userEnteredPrecision = 0;

						if (cleanViewVal.indexOf('.') !== -1) {
							userEnteredPrecisionIncludingDot = cleanViewVal.substring(
								cleanViewVal.indexOf('.')).length;
							userEnteredPrecision = userEnteredPrecisionIncludingDot - 1;

							//stripping the extra character, if any
							cleanViewVal = cleanViewVal.substring(0, cleanViewVal.indexOf('.') + precisionParam + 1);

						}

						if(userEnteredPrecisionIncludingDot === 1) {
							userEnteredPrecision = 1;
						}

						if (filterName === NUMBER_DIRECTIVE_NAME) {
							userFedPrecision = (userEnteredPrecision < precisionParam ?
								userEnteredPrecision : precisionParam);
							formattedInputViewVal = $filter(filterName)(cleanViewVal, userFedPrecision);
						} else if (filterName === CURRENCY_DIRECTIVE_NAME || filterName === PERCENTAGE_DIRECTIVE_NAME) {
							userFedPrecision = (userEnteredPrecision < precisionParam ?
								userEnteredPrecision : precisionParam);
							formattedInputViewVal = $filter(filterName)(cleanViewVal, firstParam, userFedPrecision);
						}

						if(userEnteredPrecisionIncludingDot === 1) {
							formattedInputViewVal = formattedInputViewVal.replace(/\.0/g, '.');
						}
						else if(cleanViewVal === '') {
							formattedInputViewVal = '';
						}

						if (formattedInputViewVal === inputViewVal) {
							return formattedInputViewVal;
						}

						//customRender(el, inputViewVal, formattedInputViewVal, ngModelCtrl, true);
						customRender(el, inputViewVal, formattedInputViewVal, ngModelCtrl);

						modelValue = formattedInputViewVal.replace(viewCleanerRegex, '');

						if (precisionParam !== 0) {
							modelValue = parseFloat(modelValue);
						} else {
							modelValue = parseInt(modelValue);
						}

						console.info('modelValue: ', modelValue);

						return modelValue;
					});

					ngModelCtrl.$formatters.push(function toView(modelValue) {

						//This whole functions tries to
						//translate the db-values to the input-view-values like
						//	3423.00 ---> `3,423` (for number and precision = any)
						//	3423.4300 ---> `$3,423.4` (for currency and precision = 1)
						//	3423.4300 ---> `3,423.43 %` (for percentage and precision = 2 or more)
						//	null ---> NaN ---> `0` (for number and precision = 0)
						//	undefined ---> NaN ---> `$0` (for currency and precision = 0)

						var viewValue;

						if (precisionParam !== 0) {
							modelValue = parseFloat(modelValue);
						} else {
							modelValue = parseInt(modelValue);
						}

						//converting the integers and floats to string so that replace can be applied easily
						//NaN ---> '0'
						modelValue = modelValue ? modelValue.toString() : '0';

						viewValue = $filter(filterName)(modelValue.replace(viewCleanerRegex, ''),
							firstParam, secondParam);

						//removing the insignificant zeros from the end
						// 	`$2,305.690` ---> `$2,305.69`, `20,345.69000 %` ---> `20,345.69 %`,
						// 	`345.609` ---> `345.609`, `2.00` --> `2`, `0.00` ---> `0`
						viewValue = viewValue.replace(/\.(\d*?)0+(\D*)$/g, function(m, grp1, grp2) {
							return (grp1.length > 0 ? "." : "") + grp1 + grp2;
						});

						//customRender(el, viewValue, modelValue, ngModelCtrl);

						return viewValue;
					});
				}
			};
		}]);
})(angular);
