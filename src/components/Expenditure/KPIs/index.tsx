import React, {  useContext, useEffect, useState } from 'react'
import KPICard from '../../../customComponents/KPICard'
import ExpenditureKPI from '../ExpenditureKPI'
import { Stack, Typography } from '@mui/material'
import { toLocal } from '../../../commonMethods/adapters'
import { Context, ContextType } from '../../../Context'
import { getAllData } from '../../../indexDB/database'
import { ExpenditureType } from '../../../types/Expenditure'
import { IncomeType, SegrigationDataType } from '../../../types/Income'

const KPIs = () => {
    let date = new Date().getDate()
    let month = new Date().getMonth()
    let year = new Date().getFullYear()

    const [expenditureData, setexpenditureData] = useState({
        totalExpenditure: 0,
        currentMonthExpenditure: 0,
        todaysExpenditure: 0
    })
    let { store } = useContext(Context) as ContextType;
    const [currentMonthExpenditureLimit, setcurrentMonthExpenditureLimit] = useState(0)
    const [currentMonthsIncome, setCurrentMonthsIncome] = useState(0)
    // let totalExpenditure = toLocal(expenditureData.totalExpenditure,'currency') as string
    let todaysExpenditure = toLocal(expenditureData.todaysExpenditure, 'currency') as string



    let getAllExpenditureData = async () => {

        let data: ExpenditureType[] = await getAllData("Expenditures") as ExpenditureType[]
        let totalExpenditure = 0
        let currentMonthExpenditure = 0;
        let date = new Date()
        let currentMonth = date.getMonth();
        let currentYear = date.getFullYear();
        let todaysExpenditure = 0;
        data.forEach((i: ExpenditureType) => {
            totalExpenditure += parseInt(i.amount)
            if (currentMonth == i.month && i.year == currentYear) {
                currentMonthExpenditure += parseInt(i.amount);

            }
            console.log(new Date(i.createdDate).toLocaleDateString() == date.toLocaleDateString())
            if (new Date(i.createdDate).toLocaleDateString() == date.toLocaleDateString()) {

                todaysExpenditure += parseInt(i.amount)
            }
        })
        setexpenditureData({
            totalExpenditure,
            currentMonthExpenditure,
            todaysExpenditure
        })
    }
    let getCurrentMonthExpLimit = () => {

        let data: IncomeType[] = store?.incomes.allTransactions;
        let income = data?.reduce((prev, current) => {

            if (current.month == month && current.year == year) {
                return prev += parseInt(current.amount)
            }
            return prev;
        }, 0)

        let incomeDivisions: SegrigationDataType[] = store?.incomes?.segregations
        let totalLimit = incomeDivisions?.reduce((prev: number, current: SegrigationDataType) => {
            if (current.name.toLowerCase() !== "savings") {
                let value = parseInt(current.minAllocation.value);
                if (current.minAllocation.type == "PERCENTAGE") {
                    value = (income / value) * 100
                }
                return prev + value
            } else {
                return prev;
            }
        }, 0)
        setcurrentMonthExpenditureLimit(totalLimit)
        setCurrentMonthsIncome(income)
    }
    useEffect(() => {
        getAllExpenditureData()
        getCurrentMonthExpLimit()
    }, [store])
    let totalExpenditureForMonth = expenditureData.currentMonthExpenditure
    let avgDailyExpenditure = toLocal((totalExpenditureForMonth / date), "currency")
    let todaysExpLimit = toLocal(((currentMonthExpenditureLimit - totalExpenditureForMonth) / (31 - date)), "number")
    console.log(currentMonthExpenditureLimit)
    return (
        <div className='kpiContainer'>
            <div className='kpiContainer-element' id="ExpenditureKPI" >

                <KPICard>
                    <ExpenditureKPI />
                </KPICard>
            </div>
            <div className='kpiContainer-element' id="ExpenditureKPI" >

                <KPICard>
                    <Stack height={'100%'} direction={"column"} alignContent={"space-between"} justifyContent={"center"}>
                        <Stack>

                            <Typography variant='h5' fontWeight={600} textAlign={'center'}>
                                Todays Expenses
                            </Typography>

                        </Stack>

                        <Typography textAlign={'center'} variant='h5' padding={"1rem"} fontWeight={600}>
                            <span style={{ fontWeight: "300" }}>{todaysExpenditure}</span>/{todaysExpLimit}
                        </Typography>
                    </Stack>

                </KPICard>
            </div>
            <div className='kpiContainer-element' id="ExpenditureKPI" >

                <KPICard>
                    <Stack height={'100%'} direction={"column"} alignContent={"space-between"} justifyContent={"center"}>
                        <Stack>

                            <Typography variant='h5' fontWeight={600} textAlign={'center'}>
                                Avg Daily Expenses
                            </Typography>

                        </Stack>

                        <Typography textAlign={'center'} variant='h5' padding={"1rem"} fontWeight={600}>
                            {avgDailyExpenditure}
                        </Typography>
                    </Stack>

                </KPICard>
            </div>

        </div>
    )
}

export default KPIs
