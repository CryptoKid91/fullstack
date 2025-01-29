import React, { useState } from 'react'

const App = () => {
	const anecdotes = [
		'If it hurts, do it more often',
		'Adding manpower to a late software project makes it later!',
		'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
		'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
		'Premature optimization is the root of all evil.',
		'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
	]

	const [selected, setSelected] = useState({
		selection: 0,
		votes: new Array(6).fill(0),
	})

	const nextAnecdote = () => {
		const sel = Math.floor(Math.random() * 6)
		const newState = { ...selected, selection: sel }
		console.log(newState)
		setSelected(newState)
	}

	const voteAnecdote = () => {
		const newState = { ...selected }
		newState.votes[selected.selection] += 1
		setSelected(newState)
	}

	return (
		<>
			<div>
				<h2>Anecdote of the day</h2>
				<p>{anecdotes[selected.selection]}</p>
				<p>Votes: {selected.votes[selected.selection]}</p>
				<br />
				<Button handleClick={nextAnecdote} text="Next anecdote" />
				<Button handleClick={voteAnecdote} text="Vote" />
			</div>
			<div>
				<h2>Most voted anecdote:</h2>
				<p>{anecdotes[selected.votes.indexOf(Math.max(...selected.votes))]}</p>
			</div>
		</>
	)
}

const Button = ({ handleClick, text }) => (
	<button onClick={handleClick}>{text}</button>
)

export default App
