# Basic Inventory Management

## Context

- We are going to manupulate invetory data to get answers of some of the questions like what was stock on particular date,
and other similar questions.

## Content

- We have a file that contains item stock details (`stock_item.csv`)
- We have a file that contains item sales details (`sales_item.csv`)
- Additonal file that contains unit conversion (`unit.csv`)


## Columns for Stock Item

- item_name (string)
- stock_arrived_on (date)
- qty (float)
- unit (string - unit name)
- purchasing_price (float - per unit)


## Columns for Sales Item

- item_name (string)
- sales_on (date)
- qty (float)
- unit (string - unit name)
- saling_price (float - per unit)


## Unit Converstion

- from_unit (string)
- to_unit (string)
- conversion_constant (float - value to multiply)


# List of questions to perform

1. Find out total profit
2. Check if particular Item is available or not
3. List out items by popularity
4. List out items by profit (asc = max profit to min profit, desc = min profit to max profit)

## all of the about question with the following varient

- till now
- till date
- on date
