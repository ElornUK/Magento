/*browser:true*/
/*global define*/
define(
	[
		'jquery',
		'Magento_Checkout/js/view/payment/default',
		'mage/url',
		'mage/translate'
	],
	function ($,Component, url,$t) {
		'use strict';

		return Component.extend({
			defaults: {
				template: 'P3_PaymentGateway/payment/form',
                creditCardExpYear: '',
                creditCardExpMonth: '',
                creditCardSsStartMonth: '',
                creditCardSsStartYear: ''
			},
			initObservable: function () {
                this._super()
                    .observe([
                        'creditCardExpYear',
                        'creditCardExpMonth',
                        'creditCardSsStartMonth',
                        'creditCardSsStartYear',
                    ]);
                return this;
            },
			getCcMonths: function() {
                return window.checkoutConfig.payment.paymentconfigdata.months['P3_PaymentGateway'];
            },
            getCcYears: function() {
                return window.checkoutConfig.payment.paymentconfigdata.years['P3_PaymentGateway'];
            },
			getCcMonthsValues: function() {
                return _.map(this.getCcMonths(), function(value, key) {
					var month_value = value.split('-');
					var month_option_text = month_value[0].replace(/^0+/, ''); 
                    return {
                        'value': month_value[0],
                        'month': month_option_text
                    }
                });
            },
            getCcYearsValues: function() {
                return _.map(this.getCcYears(), function(value, key) {
					var year_value = value.toString().substr(-2);
                    return {
                        'value': year_value,
                        'year': value
                    }
                });
            },
			setOptionDisable: function(option, item) {
				if (typeof item === "undefined"){
					$(".zionpayment select option:first-child").attr("disabled", "true");
				}
			},
			redirectAfterPlaceOrder: false,
			getData: function() {
                // Compile a custom data object
				var data = {
					method: this.getCode(),
					additional_data: {}
				};
				// Get all input fields during quote process
				var fields = 'payment_form_' + this.getCode();
				fields = document.getElementById(fields);
				if (fields) {
					fields = fields.getElementsByTagName('*');
					[].slice.call(fields).forEach((i) => {
						var name = i.name;
						data.additional_data[name] = i.value;
					});
				}
				return data;
			},
			validate: function() {
				var form = 'payment_form_' + this.getCode();
				form = document.getElementById(form);
				var validators = {
					cardNumber: {
						error: 'Must be a numeric 13-19 digit number',
						validate: v => v.match(/^(?:\d{4} ?){3} ?\d{1,4}(?: ?\d{0,3})?$/)
					},
					cardExpiryMonth: {
						error: 'Must be a valid numeric month',
						validate: v => v >= 1 && v <= 12
					},
					cardExpiryYear: {
						error: () => {
							return 'Must be a valid 2-digit year (' + new Date().getFullYear() + ' and above)';
						},
						validate: v => v >= (new Date().getFullYear().toString().substr(-2))
					},
					cardCVV: {
						error: 'Must be a valid 3 or 4 digit number',
						validate: v => v.match(/^\d{3,4}/)
					}
				};
				var isValid = true;
				var buildAlert = '';
				if (form) {
					var fields = [].slice.call(form.getElementsByTagName('*'));
					for (var i = 0; i < fields.length; i++) {

						var field = fields[i];
						var errorId = field.getAttribute('id') + '_error';
						var errorEl = document.getElementById(errorId);

						if (validators.hasOwnProperty(field.name)) {

							var validation = validators[field.name];
							var isFieldValid = validation.validate(field.value);
							var error = (typeof(validation.error) == 'function' ? validation.error() : validation.error);

							if (!isFieldValid && errorEl) {
								isValid = false;
								errorEl.innerText = error;
								errorEl.style.display = 'block';
							} else if (!isFieldValid && !errorEl) {
								isValid = false;
								buildAlert += field.getAttribute('title') + ' ' + error.charAt(0).toLowerCase() + error.substring(1) + '\n';
								// Stop spamming
							} else if (isFieldValid && errorEl) {
								errorEl.style.display = 'none';
							}
						}
					}
				}
				if (buildAlert.length > 0) {
					alert(buildAlert);
				}
				return isValid;
			},
			/**
			 * After place order callback
			 */
			afterPlaceOrder: function () {
				var title = this.item.title;
                var uri = url.build('paymentgateway/order/process');
				if (document.cookie.indexOf('P3_PaymentGateway_IntegrationMethod=iframe') > -1 ) {
					// Remove other payment methods now that product is now an order to gain space
					jQuery('.payment-method, .payment-option, .form-login').each(function(e) {
						jQuery(this).remove();
					});
					jQuery.get({
						url: uri,
						success: function(data) {
							jQuery('.payment-methods').append(data);
							jQuery('.loading-mask').remove();
							jQuery('.payment-methods .step-title').text(title);
						},
						fail: function(data) {
							window.location.replace(uri);
						}
					});
					return false;
				} else if (document.cookie.indexOf('P3_PaymentGateway_IntegrationMethod=direct') > -1 ) {
                    // Remove other payment methods now that product is now an order to gain space
                    const fields = Array.from(
                        document.getElementById('payment_form_' + this.getCode()).getElementsByTagName('*')
                    );

                    var screen_width = (window && window.screen ? window.screen.width : '0');
                    var screen_height = (window && window.screen ? window.screen.height : '0');
                    var screen_depth = (window && window.screen ? window.screen.colorDepth : '0');

                    let data = fields.reduce((carry, item) => {carry[item.name] = item.value; return carry;}, {
                        browserInfo: {
                            deviceChannel: 'browser',
                            deviceScreenResolution: screen_width + 'x' + screen_height + 'x' + screen_depth,
                            deviceAcceptLanguage: (window && window.navigator ? (window.navigator.language ? window.navigator.language : window.navigator.browserLanguage) : ''),
                            deviceIdentity: (window && window.navigator ? window.navigator.userAgent : ''),
                            deviceTimeZone: (new Date()).getTimezoneOffset(),
                            deviceCapabilities: 'javascript' + ((window && window.navigator ? navigator.javaEnabled() : false) ? ',java' : ''),
                        }
                    });

                    jQuery('.payment-method, .payment-option, .form-login').each(function(e) {
                        jQuery(this).remove();
                    });

					jQuery(".payment-methods .payment-group .step-title").hide();
					jQuery(".payment-methods .payment-group").append('<div class="processing-msg"><div class="processing-text">'+$t("We're processing your order, please do not close this page.")+'</div><div class="processig-loader"><div class="ajax-loading-img"></div></div></div>');

                    jQuery.post({
                        url: uri,
                        data,
                        success: function(data) {
                            if (data.hasOwnProperty('success') && data.hasOwnProperty('path')) {
                                window.location.replace(url.build(data.path));
                            } else {
                                jQuery('.payment-methods').append(data);
                                jQuery('.loading-mask').remove();
                                jQuery('.payment-methods .step-title').text(title);
                            }
                        },
                        fail: function(data) {
                            window.location.replace(url.build(data.path));
                        }
                    });
                    return false;
                } else {
					window.location.replace(uri);
				}
			}
		});
	}
);

