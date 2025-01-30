import { useState } from 'react';

const App = () => {
	// tallenna napit omaan tilaansa
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	return (
		<div>
			<h1>Give feedback</h1>
			<Button handleClick={() => setGood(good + 1)} text="good" />
			<Button
				handleClick={() => setNeutral(neutral + 1)}
				text="neutral"
			/>
			<Button handleClick={() => setBad(bad + 1)} text="bad" />
			<br />
			<Statistics good={good} neutral={neutral} bad={bad} />
			{/* <h2>Statistics</h2>
			<p>Good: {good}</p>
			<p>Neutral: {neutral}</p>
			<p>Bad: {bad}</p>
			<p>All: {good + neutral + bad}</p>
			<p>Average: {(good - bad) / (good + neutral + bad)}</p>
			<p>Positive: {(good / (good + neutral + bad)) * 100 + ' %'}</p> */}
		</div>
	);
};

const Statistics = ({ good, neutral, bad }) => {
	const all = good + neutral + bad;
	if (all == 0) {
		return (
			<div>
				<h2>Statistics</h2>
				<p>No feedback given</p>
			</div>
		);
	} else {
		return (
			<div>
				{/* <h2>Statistics</h2>
				<p>Good: {good}</p>
				<p>Neutral: {neutral}</p>
				<p>Bad: {bad}</p>
				<p>All: {good + neutral + bad}</p>
				<p>Average: {(good - bad) / (good + neutral + bad)}</p>
				<p>Positive: {(good / (good + neutral + bad)) * 100 + ' %'}</p> */}
				<StatisticLine text="Good" value={good} />
				<StatisticLine text="Neutral" value={neutral} />
				<StatisticLine text="Bad" value={bad} />
				<StatisticLine text="All" value={all} />
				<StatisticLine text="Average" value={(good - bad) / all} />
				<StatisticLine
					text="Positive"
					value={(good / all) * 100 + ' %'}
				/>
			</div>
		);
	}
};

const StatisticLine = ({ text, value }) => (
	<p>
		{text}: {value}
	</p>
);

const Button = ({ handleClick, text }) => (
	<button onClick={handleClick}>{text}</button>
);

export default App;
