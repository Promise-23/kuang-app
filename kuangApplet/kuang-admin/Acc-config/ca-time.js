import moment from 'moment'
moment.locale('zh-cn');
import {start_date,end_date} from '@/Acc-config/date.js'

let current = ()=>{
	/* 进入页面获取当前的年月日 */
	const C_year = moment().format('YYYY')//当前年
	const C_month = moment().format('M')//当前月
	const C_day = moment().format('D')//当前日
	const N_year = moment().add(1,'year').format('YYYY')//明年
	// 获取今年和明年------------------年
	start_date[0] = [{time:C_year,name:C_year + '年'},{time:N_year,name:N_year + '年'}]
	end_date[0] = [{time:C_year,name:C_year + '年'},{time:N_year,name:N_year + '年'}]
	// 获取从当年月开始计算：本月到12月----------月
	for(let w = C_month; w <= 12; w++){
		start_date[1].push({time:Number(w),name:w + '月'})
		end_date[1].push({time:Number(w),name:w + '月'})
	}
	
	// 获取今年每个月的天数：从当前月开始计算2022/05-------日
	const Days = moment(C_year + '/' + C_month, 'YYYY/M').daysInMonth()//当前月的天数
	for(let i = C_day; i <= Days; i++){
		start_date[2].push({time:Number(i),name:i + '日'})
		end_date[2].push({time:Number(i),name:i + '日'})
	}
}

// 计算本月或1月到12月
let months = (years)=>{
	const C_month = moment().format('M')//当前月
	const N_year = moment().add(1,'year').format('YYYY')//明年
	let MONTH = years == N_year ? 1 : C_month
	let mohth_data = []
	for(let w = Number(MONTH); w <= 12; w++){
		mohth_data.push({time:Number(w),name:w + '月'})
	}
	return mohth_data
}

// 计算本月的天数
let codays = (years)=>{
	const C_year = moment().format('YYYY')//当前年
	const C_month = moment().format('M')//当前月
	const C_day = moment().format('D')//当前日
	// 如果滚动在当前年月，那么"日"要从今天算起
	let INIT = years.year == C_year && years.month == C_month ? C_day : 1
	const new_data = []
	const Days = moment(years.year + '/' + years.month, 'YYYY/M').daysInMonth()//当月的天数
	for(let i = Number(INIT); i <= Days; i++){
		new_data.push({time:Number(i),name:i + '日'})
	}
	return new_data
}


export {current,months,codays}