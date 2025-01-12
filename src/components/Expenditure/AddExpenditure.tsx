import { Stack, Typography, FormControl, FormLabel, TextField, Select, MenuItem, Button } from '@mui/material'

import {  useContext, useState } from 'react'
import { addData, getAllData, getData } from '../../indexDB/database'
import { savingsQuotes } from '../../variables/Variables'
import { months } from '../../variables/dropdowns'
import { AddExpenditurePayloadType } from '../../types/Expenditure'

import { capitalize } from '../../commonMethods/adapters'
import { Context, ContextType } from '../../Context'

const AddExpenditure = ({ handleClose }) => {
      let {store, updateContextStore, refreshContextStore } = useContext(Context) as ContextType ;
    
    const [expenditure, setExpenditure] = useState<AddExpenditurePayloadType>({
        amount: "0",
        name: "",
        createdDate: new Date(),
        month: (new Date).getUTCMonth(),
        year: (new Date).getFullYear(),
        userId: 0,
        category:""
    })
    let handleOnChange = (event) => {
        let value = event.target.value;

        setExpenditure(prev => {
            if (event.target.name == "createdDate") {
                value = new Date(event.target.value);
                prev.month = value.getUTCMonth()
            }

            return {
                ...prev,
                [event.target.name]: value
            }
        })
    }
    let todaysQuote = savingsQuotes[(new Date()).getDate()]
    let handleAddSavings = async () => {
        
        await addData(expenditure, "Expenditures")
        refreshContextStore("Expenditures")
        handleClose()
    }
    let categories = store.incomes.segregations?.map((i)=> i.name)??[];
    let expenditureDivisions = categories;
    return (

        <Stack spacing={"1rem"}>
            <Stack justifyContent={'center'} alignItems={'center'}>
                {/* <img src={'/savings-pig.svg'} width={'20%'}  /> */}

                <Typography variant='caption' textAlign={"center"} marginTop={'.5rem'}>
                    <span style={{
                        padding: "1rem"
                    }}>

                        {todaysQuote}
                    </span>
                </Typography>
            </Stack>
            <FormControl>
                <FormLabel>
                    Description
                </FormLabel>
                <TextField name='name' onChange={handleOnChange} value={expenditure.name} />
            </FormControl>
            <FormControl>
                    <FormLabel>
                        Category
                    </FormLabel>
                    <Select name='category' value={expenditure.category} onChange={handleOnChange}>
                        {expenditureDivisions.map((i) => {
                            return <MenuItem value={i}>
                                {capitalize(i,"FIRST LETTER OF ALL")}
                            </MenuItem>
                        })}
                    </Select>
                </FormControl>
            <FormControl>
                <FormLabel>
                    Amount
                </FormLabel>
                <TextField name='amount' onChange={handleOnChange} value={expenditure.amount} />
            </FormControl>
            <div style={{
                display: 'grid',
                gridTemplateColumns: "1fr 1fr",
                columnGap: '1rem',
                flexDirection: "column"
            }}>

                <FormControl>
                    <FormLabel>
                        Month
                    </FormLabel>
                    <Select name='month' value={expenditure.month} onChange={handleOnChange}>
                        {Object.keys(months).map((i) => {
                            return <MenuItem value={months[i]}>
                                {i}
                            </MenuItem>
                        })}
                    </Select>
                </FormControl>
              
                <FormControl>
                    <FormLabel>
                        Date
                    </FormLabel>
                   
                    <TextField  value={new Date(expenditure.createdDate).toISOString().split("T")[0]} name='createdDate' onChange={handleOnChange} type='date' />
                </FormControl>
            </div>
            <Button onClick={handleAddSavings} variant="contained" sx={{ backgroundColor: 'black' }}>
                Add
            </Button>
        </Stack>

    )
}


export default AddExpenditure