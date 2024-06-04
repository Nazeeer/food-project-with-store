import React, { useEffect, useState } from 'react'
import classes from './AvailableMeals.module.css'
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';

const AvailableMeals = () => {
  const [meals ,setMeals] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  useEffect(()=>{
    const fetchMeals = async ()=>{
      
      const response = await fetch('https://react-http-92d63-default-rtdb.firebaseio.com/meals.json');

      if(!response.ok){
        return new Error('Something went wrong!')
      }

      const data = await response.json();
      console.log(data);

      const loadedMeals = [];
      for (const key in data){
        loadedMeals.push({
          id: key,
          name : data[key].name,
          description : data[key].description,
          price : data[key].price,
        })
      }
      setMeals(loadedMeals)
      setIsLoading(false)
      console.log(loadedMeals);
    }


    fetchMeals().catch(error =>{
      setIsLoading(false);
      setHttpError(error.message);
    });

  },[])
  
  if(isLoading){
    return (
    <section className={classes.MealsLoading}>
      <p>Loading...</p>
    </section>
  )}
  
  if(httpError){
    return (
    <section className={classes.MealsError}>
      <p>{httpError}</p>
    </section>
  )}

  const mealsList = meals.map((meal , i) => (
  <MealItem 
  id={meal.id} 
  key={i} 
  name={meal.name} 
  description={meal.description} 
  price={meal.price} 
  />
  ))
  return (
    <section className={classes.meals}>
      <Card><ul>{mealsList}</ul></Card>
    </section>
  )
}

export default AvailableMeals