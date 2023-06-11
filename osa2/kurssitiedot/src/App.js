import React from 'react'

const Header = ({ course: { name } }) => {
	return <h1>{name}</h1>
}

const Content = ({ course: { parts } }) => {
	return (
		<div>
			{parts.map((part) => (
				<p key={part.name}>
					{part.name} {part.exercises}
				</p>
			))}
		</div>
	)
}

const Total = ({ course: { parts } }) => {
	return (
		<p>
			Total of {parts.reduce((total, i) => total + i.exercises, 0)} exercises
		</p>
	)
}

const Course = ({ course }) => {
	return (
		<>
			<Header course={course} />
			<Content course={course} />
			<Total course={course} />
		</>
	)
}

const App = () => {
	const course = {
		name: 'Half Stack application development',
		parts: [
			{
				name: 'Fundamentals of React',
				exercises: 10,
				id: 1,
			},
			{
				name: 'Using props to pass data',
				exercises: 7,
				id: 2,
			},
			{
				name: 'State of a component',
				exercises: 14,
				id: 3,
			},
			{
				name: 'Redux',
				exercises: 11,
				id: 4,
			},
		],
	}

	return (
		<div>
			<Course course={course} />
		</div>
	)
}

export default App
