<template>
	<div class="popup-result">
		<p class="title">Next 5 run times</p>
		<ul class="popup-result-scroll">
			<template v-if='isShow'>
				<li v-for='item in resultList' :key="item">{{item}}</li>
			</template>
			<li v-else>Calculating...</li>
		</ul>
	</div>
</template>

<script>
export default {
	data() {
		return {
			dayRule: '',
			dayRuleSup: '',
			dateArr: [],
			resultList: [],
			isShow: false
		}
	},
	name: 'crontab-result',
	methods: {
		// When the Pattern value changes, start calculating the results.
		expressionChange() {

			// Calculation starts - hidden results
			this.isShow = false;
			// Get the rule array [0 seconds, 1 minute, 2 hours, 3 days, 4 months, 5 weeks, 6 years]
			let ruleArr = this.$options.propsData.ex.split(' ');
			// Used to record the number of times the loop is entered
			let nums = 0;
			// Array used to temporarily store symbolic time rule results
			let resultArr = [];
			// Get the current time accurate to[Year、moon、day、hour、point、Second]
			let nTime = new Date();
			let nYear = nTime.getFullYear();
			let nMonth = nTime.getMonth() + 1;
			let nDay = nTime.getDate();
			let nHour = nTime.getHours();
			let nMin = nTime.getMinutes();
			let nSecond = nTime.getSeconds();
			// Obtain possible year arrays, month arrays, etc. in the past 100 years according to the rules
			this.getSecondArr(ruleArr[0]);
			this.getMinArr(ruleArr[1]);
			this.getHourArr(ruleArr[2]);
			this.getDayArr(ruleArr[3]);
			this.getMonthArr(ruleArr[4]);
			this.getWeekArr(ruleArr[5]);
			this.getYearArr(ruleArr[6], nYear);
			// Assign the obtained array - convenient to use
			let sDate = this.dateArr[0];
			let mDate = this.dateArr[1];
			let hDate = this.dateArr[2];
			let DDate = this.dateArr[3];
			let MDate = this.dateArr[4];
			let YDate = this.dateArr[5];
			// Get the index of the current time in the array
			let sIdx = this.getIndex(sDate, nSecond);
			let mIdx = this.getIndex(mDate, nMin);
			let hIdx = this.getIndex(hDate, nHour);
			let DIdx = this.getIndex(DDate, nDay);
			let MIdx = this.getIndex(MDate, nMonth);
			let YIdx = this.getIndex(YDate, nYear);
			// Reset function for month, day, hour, minute and second (used more later)
			const resetSecond = function () {
				sIdx = 0;
				nSecond = sDate[sIdx]
			}
			const resetMin = function () {
				mIdx = 0;
				nMin = mDate[mIdx]
				resetSecond();
			}
			const resetHour = function () {
				hIdx = 0;
				nHour = hDate[hIdx]
				resetMin();
			}
			const resetDay = function () {
				DIdx = 0;
				nDay = DDate[DIdx]
				resetHour();
			}
			const resetMonth = function () {
				MIdx = 0;
				nMonth = MDate[MIdx]
				resetDay();
			}
			// If the current year is not the current value in the array
			if (nYear !== YDate[YIdx]) {
				resetMonth();
			}
			// If the current month is not the current value in the array
			if (nMonth !== MDate[MIdx]) {
				resetDay();
			}
			// If the current "day" is not the current value in the array
			if (nDay !== DDate[DIdx]) {
				resetHour();
			}
			// If the current "time" is not the current value in the array
			if (nHour !== hDate[hIdx]) {
				resetMin();
			}
			// If the current "minute" is not the current value in the array
			if (nMin !== mDate[mIdx]) {
				resetSecond();
			}

			// Loop through year array
			goYear: for (let Yi = YIdx; Yi < YDate.length; Yi++) {
				let YY = YDate[Yi];
				// If the Max Value is reached
				if (nMonth > MDate[MDate.length - 1]) {
					resetMonth();
					continue;
				}
				// Loop through month array
				goMonth: for (let Mi = MIdx; Mi < MDate.length; Mi++) {
					// Assignment to facilitate subsequent operations
					let MM = MDate[Mi];
					MM = MM < 10 ? '0' + MM : MM;
					// If the Max Value is reached
					if (nDay > DDate[DDate.length - 1]) {
						resetDay();
						if (Mi == MDate.length - 1) {
							resetMonth();
							continue goYear;
						}
						continue;
					}
					// Loop through date array
					goDay: for (let Di = DIdx; Di < DDate.length; Di++) {
						// Assignment to facilitate subsequent operations
						let DD = DDate[Di];
						let thisDD = DD < 10 ? '0' + DD : DD;

						// If the Max Value is reached
						if (nHour > hDate[hDate.length - 1]) {
							resetHour();
							if (Di == DDate.length - 1) {
								resetDay();
								if (Mi == MDate.length - 1) {
									resetMonth();
									continue goYear;
								}
								continue goMonth;
							}
							continue;
						}

						// Determine the legality of the date. If it is illegal, it will jump out of the current loop.
						if (this.checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true && this.dayRule !== 'workDay' && this.dayRule !== 'lastWeek' && this.dayRule !== 'lastDay') {
							resetDay();
							continue goMonth;
						}
						// If there is a value in the date rule
						if (this.dayRule == 'lastDay') {
							// If it is not a legal date, you need to adjust the date to the legal date, which is the last day of the month.

							if (this.checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true) {
								while (DD > 0 && this.checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true) {
									DD--;

									thisDD = DD < 10 ? '0' + DD : DD;
								}
							}
						} else if (this.dayRule == 'workDay') {
							// Verify and adjust. If a date like February 30 is passed in, it needs to be adjusted to the normal end of the month.
							if (this.checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true) {
								while (DD > 0 && this.checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true) {
									DD--;
									thisDD = DD < 10 ? '0' + DD : DD;
								}
							}
							// Get the date that meets the condition is week X
							let thisWeek = this.formatDate(new Date(YY + '-' + MM + '-' + thisDD + ' 00:00:00'), 'week');
							// when sunday
							if (thisWeek == 1) {
								// First find the next day and determine whether it is the end of the month
								DD++;
								thisDD = DD < 10 ? '0' + DD : DD;
								// Determine that the next day is no longer a legal date
								if (this.checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true) {
									DD -= 3;
								}
							} else if (thisWeek == 7) {
								// When it is Saturday, you only need to judge that it is not the 1st and you can proceed.
								if (this.dayRuleSup !== 1) {
									DD--;
								} else {
									DD += 2;
								}
							}
						} else if (this.dayRule == 'weekDay') {
							// If Specified, it is the day of the week
							// Get the day of the week that the current date belongs to
							let thisWeek = this.formatDate(new Date(YY + '-' + MM + '-' + DD + ' 00:00:00'), 'week');
							// Verify whether the current week is in the week pool (dayRuleSup)
							if (this.dayRuleSup.indexOf(thisWeek) < 0) {
								// If the Max Value is reached
								if (Di == DDate.length - 1) {
									resetDay();
									if (Mi == MDate.length - 1) {
										resetMonth();
										continue goYear;
									}
									continue goMonth;
								}
								continue;
							}
						} else if (this.dayRule == 'assWeek') {
							// If Specified is the day of the week of the week
							// Get the day of the week that the 1st of each month belongs to
							let thisWeek = this.formatDate(new Date(YY + '-' + MM + '-' + DD + ' 00:00:00'), 'week');
							if (this.dayRuleSup[1] >= thisWeek) {
								DD = (this.dayRuleSup[0] - 1) * 7 + this.dayRuleSup[1] - thisWeek + 1;
							} else {
								DD = this.dayRuleSup[0] * 7 + this.dayRuleSup[1] - thisWeek + 1;
							}
						} else if (this.dayRule == 'lastWeek') {
							// If Specified the last day of the week of Every month
							// Verify and adjust. If a date like February 30 is passed in, it needs to be adjusted to the normal end of the month.
							if (this.checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true) {
								while (DD > 0 && this.checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true) {
									DD--;
									thisDD = DD < 10 ? '0' + DD : DD;
								}
							}
							// Get the day of the week that the last day of the month is
							let thisWeek = this.formatDate(new Date(YY + '-' + MM + '-' + thisDD + ' 00:00:00'), 'week');
							// Find the nearest day of the week in the request
							if (this.dayRuleSup < thisWeek) {
								DD -= thisWeek - this.dayRuleSup;
							} else if (this.dayRuleSup > thisWeek) {
								DD -= 7 - (this.dayRuleSup - thisWeek)
							}
						}
						// Determine whether the time value is less than 10 and replace it with the format of "05"
						DD = DD < 10 ? '0' + DD : DD;

						// Looping over "when" array
						goHour: for (let hi = hIdx; hi < hDate.length; hi++) {
							let hh = hDate[hi] < 10 ? '0' + hDate[hi] : hDate[hi]

							// If the Max Value is reached
							if (nMin > mDate[mDate.length - 1]) {
								resetMin();
								if (hi == hDate.length - 1) {
									resetHour();
									if (Di == DDate.length - 1) {
										resetDay();
										if (Mi == MDate.length - 1) {
											resetMonth();
											continue goYear;
										}
										continue goMonth;
									}
									continue goDay;
								}
								continue;
							}
							// Loop "divide" an array
							goMin: for (let mi = mIdx; mi < mDate.length; mi++) {
								let mm = mDate[mi] < 10 ? '0' + mDate[mi] : mDate[mi];

								// If the Max Value is reached
								if (nSecond > sDate[sDate.length - 1]) {
									resetSecond();
									if (mi == mDate.length - 1) {
										resetMin();
										if (hi == hDate.length - 1) {
											resetHour();
											if (Di == DDate.length - 1) {
												resetDay();
												if (Mi == MDate.length - 1) {
													resetMonth();
													continue goYear;
												}
												continue goMonth;
											}
											continue goDay;
										}
										continue goHour;
									}
									continue;
								}
								// Loop over "seconds" array
								goSecond: for (let si = sIdx; si <= sDate.length - 1; si++) {
									let ss = sDate[si] < 10 ? '0' + sDate[si] : sDate[si];
									// Add the current time (the legality of the time has been judged during the date cycle)
									if (MM !== '00' && DD !== '00') {
										resultArr.push(YY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss)
										nums++;
									}
									// If the number of items is full, exit the loop
									if (nums == 5) break goYear;
									// If the Max Value is reached
									if (si == sDate.length - 1) {
										resetSecond();
										if (mi == mDate.length - 1) {
											resetMin();
											if (hi == hDate.length - 1) {
												resetHour();
												if (Di == DDate.length - 1) {
													resetDay();
													if (Mi == MDate.length - 1) {
														resetMonth();
														continue goYear;
													}
													continue goMonth;
												}
												continue goDay;
											}
											continue goHour;
										}
										continue goMin;
									}
								} //goSecond
							} //goMin
						}//goHour
					}//goDay
				}//goMonth
			}
			// Determine the number of results within 100 years
			if (resultArr.length == 0) {
				this.resultList = ['No results matching the condition!'];
			} else {
				this.resultList = resultArr;
				if (resultArr.length !== 5) {
					this.resultList.push('Only ' + resultArr.length + ' results in the last 100 years!')
				}
			}
			// Calculation completed - display results
			this.isShow = true;


		},
		// Used to calculate the index of a number in an array
		getIndex(arr, value) {
			if (value <= arr[0] || value > arr[arr.length - 1]) {
				return 0;
			} else {
				for (let i = 0; i < arr.length - 1; i++) {
					if (value > arr[i] && value <= arr[i + 1]) {
						return i + 1;
					}
				}
			}
		},
		// Get the "year" array
		getYearArr(rule, year) {
			this.dateArr[5] = this.getOrderArr(year, year + 100);
			if (rule !== undefined) {
				if (rule.indexOf('-') >= 0) {
					this.dateArr[5] = this.getCycleArr(rule, year + 100, false)
				} else if (rule.indexOf('/') >= 0) {
					this.dateArr[5] = this.getAverageArr(rule, year + 100)
				} else if (rule !== '*') {
					this.dateArr[5] = this.getAssignArr(rule)
				}
			}
		},
		// Get the "month" array
		getMonthArr(rule) {
			this.dateArr[4] = this.getOrderArr(1, 12);
			if (rule.indexOf('-') >= 0) {
				this.dateArr[4] = this.getCycleArr(rule, 12, false)
			} else if (rule.indexOf('/') >= 0) {
				this.dateArr[4] = this.getAverageArr(rule, 12)
			} else if (rule !== '*') {
				this.dateArr[4] = this.getAssignArr(rule)
			}
		},
		// Get the "day" array - mainly date rules
		getWeekArr(rule) {
			// Only when both values ​​of the date rule are "", the expression date has Options.
			if (this.dayRule == '' && this.dayRuleSup == '') {
				if (rule.indexOf('-') >= 0) {
					this.dayRule = 'weekDay';
					this.dayRuleSup = this.getCycleArr(rule, 7, false)
				} else if (rule.indexOf('#') >= 0) {
					this.dayRule = 'assWeek';
					let matchRule = rule.match(/[0-9]{1}/g);
					this.dayRuleSup = [Number(matchRule[1]), Number(matchRule[0])];
					this.dateArr[3] = [1];
					if (this.dayRuleSup[1] == 7) {
						this.dayRuleSup[1] = 0;
					}
				} else if (rule.indexOf('L') >= 0) {
					this.dayRule = 'lastWeek';
					this.dayRuleSup = Number(rule.match(/[0-9]{1,2}/g)[0]);
					this.dateArr[3] = [31];
					if (this.dayRuleSup == 7) {
						this.dayRuleSup = 0;
					}
				} else if (rule !== '*' && rule !== '?') {
					this.dayRule = 'weekDay';
					this.dayRuleSup = this.getAssignArr(rule)
				}
			}
		},
		// Get the "day" array - a small number of date rules
		getDayArr(rule) {
			this.dateArr[3] = this.getOrderArr(1, 31);
			this.dayRule = '';
			this.dayRuleSup = '';
			if (rule.indexOf('-') >= 0) {
				this.dateArr[3] = this.getCycleArr(rule, 31, false)
				this.dayRuleSup = 'null';
			} else if (rule.indexOf('/') >= 0) {
				this.dateArr[3] = this.getAverageArr(rule, 31)
				this.dayRuleSup = 'null';
			} else if (rule.indexOf('W') >= 0) {
				this.dayRule = 'workDay';
				this.dayRuleSup = Number(rule.match(/[0-9]{1,2}/g)[0]);
				this.dateArr[3] = [this.dayRuleSup];
			} else if (rule.indexOf('L') >= 0) {
				this.dayRule = 'lastDay';
				this.dayRuleSup = 'null';
				this.dateArr[3] = [31];
			} else if (rule !== '*' && rule !== '?') {
				this.dateArr[3] = this.getAssignArr(rule)
				this.dayRuleSup = 'null';
			} else if (rule == '*') {
				this.dayRuleSup = 'null';
			}
		},
		// Get the "time" array
		getHourArr(rule) {
			this.dateArr[2] = this.getOrderArr(0, 23);
			if (rule.indexOf('-') >= 0) {
				this.dateArr[2] = this.getCycleArr(rule, 24, true)
			} else if (rule.indexOf('/') >= 0) {
				this.dateArr[2] = this.getAverageArr(rule, 23)
			} else if (rule !== '*') {
				this.dateArr[2] = this.getAssignArr(rule)
			}
		},
		// Get the "minutes" array
		getMinArr(rule) {
			this.dateArr[1] = this.getOrderArr(0, 59);
			if (rule.indexOf('-') >= 0) {
				this.dateArr[1] = this.getCycleArr(rule, 60, true)
			} else if (rule.indexOf('/') >= 0) {
				this.dateArr[1] = this.getAverageArr(rule, 59)
			} else if (rule !== '*') {
				this.dateArr[1] = this.getAssignArr(rule)
			}
		},
		// Get the "seconds" array
		getSecondArr(rule) {
			this.dateArr[0] = this.getOrderArr(0, 59);
			if (rule.indexOf('-') >= 0) {
				this.dateArr[0] = this.getCycleArr(rule, 60, true)
			} else if (rule.indexOf('/') >= 0) {
				this.dateArr[0] = this.getAverageArr(rule, 59)
			} else if (rule !== '*') {
				this.dateArr[0] = this.getAssignArr(rule)
			}
		},
		// A sequential array based on the min-maxBack passed in
		getOrderArr(min, max) {
			let arr = [];
			for (let i = min; i <= max; i++) {
				arr.push(i);
			}
			return arr;
		},
		// Back an array based on the scattered values ​​of Specified in the rule
		getAssignArr(rule) {
			let arr = [];
			let assiginArr = rule.split(',');
			for (let i = 0; i < assiginArr.length; i++) {
				arr[i] = Number(assiginArr[i])
			}
			arr.sort(this.compare)
			return arr;
		},
		// Calculate Back an array according to certain arithmetic rules
		getAverageArr(rule, limit) {
			let arr = [];
			let agArr = rule.split('/');
			let min = Number(agArr[0]);
			let step = Number(agArr[1]);
			while (min <= limit) {
				arr.push(min);
				min += step;
			}
			return arr;
		},
		// Back a periodic array according to the rules
		getCycleArr(rule, limit, status) {
			// status--indicates whether to start from 0 (then start from 1)
			let arr = [];
			let cycleArr = rule.split('-');
			let min = Number(cycleArr[0]);
			let max = Number(cycleArr[1]);
			if (min > max) {
				max += limit;
			}
			for (let i = min; i <= max; i++) {
				let add = 0;
				if (status == false && i % limit == 0) {
					add = limit;
				}
				arr.push(Math.round(i % limit + add))
			}
			arr.sort(this.compare)
			return arr;
		},
		// Compare numbers (for Array.sort)
		compare(value1, value2) {
			if (value2 - value1 > 0) {
				return -1;
			} else {
				return 1;
			}
		},
		// Format date format such as: 2017-9-19 18:04:33
		formatDate(value, type) {
			// Calculate date related values
			let time = typeof value == 'number' ? new Date(value) : value;
			let Y = time.getFullYear();
			let M = time.getMonth() + 1;
			let D = time.getDate();
			let h = time.getHours();
			let m = time.getMinutes();
			let s = time.getSeconds();
			let week = time.getDay();
			// If type is passed
			if (type == undefined) {
				return Y + '-' + (M < 10 ? '0' + M : M) + '-' + (D < 10 ? '0' + D : D) + ' ' + (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
			} else if (type == 'week') {
				// In quartz 1 is Sunday
				return week + 1;
			}
		},
		// Check if date exists
		checkDate(value) {
			let time = new Date(value);
			let format = this.formatDate(time)
			return value === format;
		}
	},
	watch: {
		'ex': 'expressionChange'
	},
	props: ['ex'],
	mounted: function () {
		// Initialize and get the result once
		this.expressionChange();
	}
}

</script>
