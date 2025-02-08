import { Stack, Typography, LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { ContextType, useContextv2 } from '../../../Context';
import Progress from '../../../customComponents/Progress';
import { BudgetsType } from '../../../types/Budgets';
import { toLocal } from '../../../methods/adapters';
import { red } from '@mui/material/colors';

interface PropsType {
  budgetData: BudgetsType;
}
let getCategoryAmountOnType = (category:BudgetsType["categories"][0],budget:BudgetsType):number=>{
  let value = 0;
  if(category.amountType == "PERCENTAGE"){
    value = parseInt(budget.amount) * (parseInt(category.amount)/100);
    return value;
  }
  return parseInt(category.amount);

}

const BudgetDetails = ({ budgetData }: PropsType) => {
  const { store } = useContextv2() as ContextType;
  const transactions = store.transactions;

  const [categorySpending, setCategorySpending] = useState<{ [key: string]: {limit:number;spent:number} }>({});

  useEffect(() => {
    
    const budgetMap: { [key: string]: {spent:number,limit:number} } = {};

    // Initialize categories with zero spending
    budgetData.categories?.forEach(category => {
      budgetMap[category.id] = {spent:0,limit:getCategoryAmountOnType(category,budgetData)};
    });

    // Aggregate spending per category
    transactions.forEach(transaction => {
      
      if (transaction.budgetCategoryId && budgetMap.hasOwnProperty(transaction.budgetCategoryId)) {
        let tCategory = budgetMap[transaction.budgetCategoryId]
        if(budgetMap[transaction.budgetCategoryId]){
          tCategory.spent+= parseFloat(transaction.amount);
        }
      }
    });
    console.log(budgetMap,"Budgetmap")
    setCategorySpending(budgetMap);
  }, [transactions, budgetData]);
 
  return (
    <Stack spacing={3} padding={2}>

      {budgetData.categories.map((category) => {
        const {spent=0,limit=0} = categorySpending[category.id] || {};
        const spentPercentage = Math.min((spent / limit) * 100, 100); // Ensures max 100%
        let getSpentValueJsx = ({spent,limit})=>{
          if(spent >limit){
            return <>
            {toLocal(limit,"currency")}
            +
            <span style={{color:red[900], fontWeight:"600"}}>
              {spent-limit}
            </span>
            </>
          }
          return  spent.toFixed(2)
        }
        return (
          <Stack key={category.name} spacing={1} sx={{  padding: 1 }}>
            <Typography fontWeight={500}>{category.name}</Typography>

            <Stack direction="row"  gap={'.5rem'} justifyContent="start">
              <Typography>Spent:</Typography>
              <Typography>{getSpentValueJsx({spent,limit})}</Typography>
            </Stack>

            <Stack direction="row" gap={'.5rem'} justifyContent="start">
              <Typography>Budget:</Typography>
              <Typography>{toLocal(category?.amount,"currency")}</Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={spentPercentage}
              sx={{ height: 8, borderRadius: 1 }}
              color={spentPercentage >= 100 ? 'error' : 'primary'}
            />

            <Typography variant="body2" textAlign="right">
              {spentPercentage.toFixed(2)}% used
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default BudgetDetails;
