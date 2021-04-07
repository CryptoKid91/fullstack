import React, { useState } from 'react'

const App = () => {
	// tallenna napit omaan tilaansa
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	return (
		<div>
			<h1>Give feedback</h1>
			<Button handleClick={() => setGood(good + 1)} text="good" />
			<Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
			<Button handleClick={() => setBad(bad + 1)} text="bad" />
			<br />
			<br />
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	)
}

const Statistics = ({ good, neutral, bad }) => {
	if (good + neutral + bad !== 0) {
		return (
			<table>
				<thead>
					<tr>
						<th>Statistics</th>
					</tr>
				</thead>
				<tbody>
					<StatisticLine text="Good" value={good} />
					<StatisticLine text="Neutral" value={neutral} />
					<StatisticLine text="Bad" value={bad} />
					<StatisticLine text="All" value={good + neutral + bad} />
					<StatisticLine
						text="Average"
						value={(good - bad) / (good + neutral + bad)}
					/>
					<StatisticLine
						text="Positive"
						value={(good / (good + neutral + bad)) * 100 + ' %'}
					/>
				</tbody>
			</table>
		)
	} else {
		return (
			<div>
				<p>No feedback given</p>
			</div>
		)
	}
}

const StatisticLine = ({ text, value }) => (
	<tr>
		<td>{text}:</td>
		<td>{value}</td>
	</tr>
)

const Button = ({ handleClick, text }) => (
	<button onClick={handleClick}>{text}</button>
)

export default App
