import React from 'react';

const Header = ({ course: { name } }) => {
	return <h2>{name}</h2>;
};

const Content = ({ course: { parts } }) => {
	return (
		<div>
			{parts.map((part) => (
				<p key={part.id}>
					{part.name} {part.exercises}
				</p>
			))}
		</div>
	);
};

const Total = ({ course: { parts } }) => {
	return (
		<p>
			<b>
				Total of {parts.reduce((total, i) => total + i.exercises, 0)}{' '}
				exercises
			</b>
		</p>
	);
};

const Course = ({ courses }) => {
	return (
		<>
			{courses.map((course) => (
				<div key={course.id}>
					<Header course={course} />
					<Content course={course} />
					<Total course={course} />
				</div>
			))}
		</>
	);
};

export default Course;
