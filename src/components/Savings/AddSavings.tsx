import { Button, FormControl, FormLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { AddSavingsPayloadType } from '../../types/Savings'
import { months } from '../../variables/dropdowns'
import { useStaticVariable } from '../../hooks/StaticVariable'
import { green } from '@mui/material/colors'
import { savingsQuotes } from '../../variables/Variables'
import { addData, addSavings } from '../../indexDB/database'

const AddSavings = ({handleClose}) => {
    const [savings, setSavings] = useState<AddSavingsPayloadType>({
        amount: 0,
        transactionType: "CREDIT",
        createdDate: new Date(),
        month: (new Date).getMonth(),
        year: (new Date).getFullYear()

    })
    let handleOnChange = (event) => {

        setSavings(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }
    let todaysQuote = savingsQuotes[(new Date()).getDate()]

    let handleAddSavings =  async()=>{
       addData(savings,'Savings')
       handleClose()
    }
    return (

        <Stack spacing={"1rem"}>
            <Stack justifyContent={'center'} alignItems={'center'}>
            <img src={'/savings-pig.svg'} width={'20%'}  />

            <Typography  variant='caption' textAlign={"center"} marginTop={'.5rem'}>
                <span style={{
                     padding:"1rem"
                }}>

                {todaysQuote}
                </span>
            </Typography>
            </Stack>
            <FormControl>
                <FormLabel>
                    Amount
                </FormLabel>
                <TextField name='amount' onChange={handleOnChange} value={savings.amount} />
            </FormControl>
            <div style={{
                display: 'grid',
                gridTemplateColumns: "1fr 1fr",
                columnGap: '1rem'
            }}>
                <FormControl>
                    <FormLabel>
                        Type
                    </FormLabel>
                    <Select name='transactionType' value={savings.transactionType} onChange={handleOnChange}>
                        <MenuItem value={'DEBIT'} >
                            Debit
                        </MenuItem>
                        <MenuItem value={"CREDIT"}>
                            Credit
                        </MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel>
                        Month
                    </FormLabel>
                    <Select name='month' value={savings.month} onChange={handleOnChange}>
                        {Object.keys(months).map((i) => {
                            return <MenuItem value={months[i]}>
                                {i}
                            </MenuItem>
                        })}
                    </Select>
                </FormControl>
            </div>
            <Button onClick={handleAddSavings} variant="contained" sx={{backgroundColor:'black'}}>
                Add
                </Button>
        </Stack>

    )
}

export default AddSavings