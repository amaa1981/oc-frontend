<template>
	<el-form size="small">
		<el-form-item>
			<el-radio v-model='radioValue' :label="1">
				Hours, allowed wildcards [, - * /]
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model='radioValue' :label="2">
				Cycle from
				<el-input-number v-model='cycle01' :min="0" :max="22" /> -
				<el-input-number v-model='cycle02' :min="cycle01 ? cycle01 + 1 : 1" :max="23" /> hour
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model='radioValue' :label="3">
				From
				<el-input-number v-model='average01' :min="0" :max="22" /> hours, every
				<el-input-number v-model='average02' :min="1" :max="23 - average01 || 0" /> hours execute once
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model='radioValue' :label="4">
				Specified
				<el-select clearable v-model="checkboxList" placeholder="Multiple select" multiple style="width:100%">
					<el-option v-for="item in 24" :key="item" :value="item-1">{{item-1}}</el-option>
				</el-select>
			</el-radio>
		</el-form-item>
	</el-form>
</template>

<script>
export default {
	data() {
		return {
			radioValue: 1,
			cycle01: 0,
			cycle02: 1,
			average01: 0,
			average02: 1,
			checkboxList: [],
			checkNum: this.$options.propsData.check
		}
	},
	name: 'crontab-hour',
	props: ['check', 'cron'],
	methods: {
		// When radio value changes
		radioChange() {
			switch (this.radioValue) {
				case 1:
        	this.$emit('update', 'hour', '*')
        	break;
				case 2:
					this.$emit('update', 'hour', this.cycleTotal);
					break;
				case 3:
					this.$emit('update', 'hour', this.averageTotal);
					break;
				case 4:
					this.$emit('update', 'hour', this.checkboxString);
					break;
			}
		},
		// When cycle range changes
		cycleChange() {
			if (this.radioValue == '2') {
				this.$emit('update', 'hour', this.cycleTotal);
			}
		},
		// When average range changes
		averageChange() {
			if (this.radioValue == '3') {
				this.$emit('update', 'hour', this.averageTotal);
			}
		},
		// When checkbox selection changes
		checkboxChange() {
			if (this.radioValue == '4') {
				this.$emit('update', 'hour', this.checkboxString);
			}
		}
	},
	watch: {
		'radioValue': 'radioChange',
		'cycleTotal': 'cycleChange',
		'averageTotal': 'averageChange',
		'checkboxString': 'checkboxChange'
	},
	computed: {
		// Compute cycle range
		cycleTotal: function () {
			const cycle01 = this.checkNum(this.cycle01, 0, 22)
			const cycle02 = this.checkNum(this.cycle02, cycle01 ? cycle01 + 1 : 1, 23)
			return cycle01 + '-' + cycle02;
		},
		// Compute average values
		averageTotal: function () {
			const average01 = this.checkNum(this.average01, 0, 22)
			const average02 = this.checkNum(this.average02, 1, 23 - average01 || 0)
			return average01 + '/' + average02;
		},
		// Compute selected checkbox values
		checkboxString: function () {
			let str = this.checkboxList.join();
			return str == '' ? '*' : str;
		}
	}
}
</script>
