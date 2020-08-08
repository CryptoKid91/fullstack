import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = () => {
	// tallenna napit omaan tilaansa
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	return (
		<div>
			<h1>Give feedback</h1>
			<Button
				handleClick={() => setGood(good + 1)}
				text='good'
			/>
			<Button
				handleClick={() => setNeutral(neutral + 1)}
				text='neutral'
			/>
			<Button
				handleClick={() => setBad(bad + 1)}
				text='bad'
			/>
			<h1>Statistics</h1>
			<p>Good: {good}</p>
			<p>Neutral: {neutral}</p>
			<p>Bad: {bad}</p>
		</div>
	)
}

const Button = ({ handleClick, text }) => (
	<button onClick={handleClick}>
		{text}
	</button>
)

ReactDOM.render(<App />,
	document.getElementById('root')
)