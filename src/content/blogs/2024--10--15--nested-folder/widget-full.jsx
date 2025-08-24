import React from 'react'
import { create, all } from 'mathjs'
import { useEffect, useRef } from 'react'
import katex from 'katex'

const math = create(all)

class BaseRunnableWidget extends React.Component {
	findLabelParam(stateName) {
		return this.props.children.find((o) => o.props.aslabel === stateName)
	}

	handleSubmit(event) {
		event.preventDefault()
		let outputs = this.calculateFunction(this.state.fields)
		this.setState({
			outputs: outputs
		})
	}

	handleStateChange(stateName) {
		return (event) => {
			let fields = this.state.fields
			fields[stateName] = parseFloat(event.target.value)
			this.setState({
				fields: fields
			})
		}
	}

	renderResultField(stateValue) {
		if (typeof stateValue === 'boolean') {
			if (stateValue) {
				return <span className='text-green-500'>Yes</span>
			} else {
				return <span className='text-red-500'>No</span>
			}
		} else if (isFinite(stateValue) && !isNaN(stateValue)) {
			return (
				<span className='text-green-500'>
					{typeof stateValue === 'boolean' ? 'Yes' : stateValue}
				</span>
			)
		} else {
			return (
				<span className='text-red-500'>{typeof stateValue === 'boolean' ? 'No' : stateValue}</span>
			)
		}
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit.bind(this)}>
				<div className='shadow sm:rounded-md sm:overflow-hidden'>
					<div className='sm:p-6'>
						<fieldset>
							<legend className='sm:mx-6'>Parameters</legend>
							{Object.entries(this.state.fields).map(([stateName, stateValue]) => (
								<div key={stateName} className='px-4 py-5 bg-white space-y-6 sm:p-6'>
									<div className='grid grid-cols-2 gap-6'>
										<div className='col-span-2 sm:col-span-2'>
											<label htmlFor={stateName} className='block text-sm font-medium'>
												{this.findLabelParam(stateName)}
											</label>
											<input
												type='number'
												name={stateName}
												id={stateName}
												className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-md sm:text-sm border-gray-300'
												onChange={this.handleStateChange(stateName).bind(this)}
												value={stateValue}
											/>
										</div>
									</div>
								</div>
							))}
						</fieldset>
						<fieldset>
							<legend className='sm:mx-6'>Outputs</legend>
							<dl>
								{Object.entries(this.state.outputs).map(([stateName, stateValue]) => (
									<div
										key={stateName}
										className='px-4 py-6 bg-white sm:p-6 sm:grid sm:grid-cols-3 gap-6'
									>
										<div className='flex col-span-2'>
											<dt className='container'>{this.findLabelParam(stateName)}</dt>
										</div>
										<div className='flex bg-gray-100 rounded'>
											<dd className='m-auto pr-6 container text-right whitespace-nowrap overflow-hidden overflow-ellipsis'>
												{this.renderResultField(stateValue)}
											</dd>
										</div>
									</div>
								))}
							</dl>
						</fieldset>
					</div>

					<div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>
						<button
							type='submit'
							className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
						>
							Calculate
						</button>
					</div>
				</div>
			</form>
		)
	}
}

class RecursiveFunctionForm extends BaseRunnableWidget {
	constructor(props) {
		super(props)

		this.state = {
			fields: {
				input: 0,
				maxIteration: 1000,
				epsilon: 0.0001
			},
			outputs: {
				output: 0,
				iteration: 0,
				finalDelta: 0
			}
		}
	}

	calculateFunction({ input, maxIteration, epsilon }) {
		let output = input
		let iteration = 0
		let currentDelta = 0
		let prev_output
		while (true) {
			prev_output = output
			output = Math.pow(input, output)
			currentDelta = Math.abs(prev_output - output)
			iteration++
			if (iteration >= maxIteration || currentDelta <= epsilon) {
				break
			}
		}
		return {
			output: output,
			iteration: iteration,
			finalDelta: currentDelta,
			converge: currentDelta <= epsilon
		}
	}
}

class LConvergenceForm extends BaseRunnableWidget {
	constructor(props) {
		super(props)

		this.state = {
			fields: {
				input: 1,
				maxIteration: 1000,
				epsilon: 0.0001
			},
			outputs: {
				output: 0,
				iteration: 0
			}
		}
	}

	principalLambertW({ input, maxIteration, epsilon }) {
		let iteration = 1
		let sum = math.complex(0)
		let term = 0
		let denominator = 0
		let power = 0
		// we are dealing with complex number here.
		// make sure the conversion is right
		let converging = true

		// special case for W(0) = 0 by definition
		if (input === 0) {
			return {
				output: 0,
				iteration: iteration,
				converge: converging
			}
		}

		while (true) {
			denominator = math.factorial(iteration)
			// construct the power terms
			// power
			power = math.add(
				math.multiply(iteration - 1, math.log(-iteration)),
				math.multiply(iteration, math.log(input))
			)

			term = math.divide(math.exp(power), denominator)
			iteration++
			if (isNaN(term.re) || !isFinite(term.re)) {
				break
			}
			if (iteration >= maxIteration || math.abs(term.re) <= epsilon) {
				break
			}
			sum = math.add(sum, term)
		}
		// it doesn't converge if imaginary values is too high
		if (math.abs(sum.im) > epsilon) {
			converging = false
		}
		return {
			output: sum.re,
			iteration: iteration,
			converge: converging
		}
	}

	calculateFunction({ input, maxIteration, epsilon }) {
		let lambertWInput = {
			input: -math.log(input),
			maxIteration: maxIteration,
			epsilon: epsilon
		}
		let lambertWOutput = this.principalLambertW(lambertWInput)
		// special case when input is 1
		// L has to be 1 by definition
		if (input === 1) {
			return {
				output: 1,
				iteration: lambertWOutput.iteration,
				converge: lambertWOutput.converge
			}
		}
		let L = -lambertWOutput.output / math.log(input)

		return {
			output: L,
			iteration: lambertWOutput.iteration,
			converge: lambertWOutput.converge
		}
	}
}

export const RecursiveFunctionFormWrapped = () => {
	const containerRef = useRef()
	useEffect(() => {
		katex.render()
	}, [])
	return (
		<RecursiveFunctionForm ref={containerRef}>
			<div aslabel='input'>Input $a$</div>
			<div aslabel='maxIteration'>Recursion limit</div>
			<div aslabel='epsilon'>Subsequent value difference, the $\epsilon$</div>

			<div aslabel='iteration'>Iteration number</div>

			<div aslabel='finalDelta'>
				Final $\Delta$ . Difference between current output and previous iteration's output.
			</div>

			<div aslabel='output'>Converging output $L$</div>

			<div aslabel='converge'>Is it converging?</div>
		</RecursiveFunctionForm>
	)
}

export { RecursiveFunctionForm, LConvergenceForm }
