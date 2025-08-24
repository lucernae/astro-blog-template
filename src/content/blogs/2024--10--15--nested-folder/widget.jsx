import React from 'react'

class BaseRunnableWidget extends React.Component {
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

	findLabelParam(stateName) {
		console.log(this.props)
		return this.props.children.find((o) => o.props.aslabel === stateName)
	}

	handleSubmit(event) {
		event.preventDefault()
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
							<dl></dl>
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

class BaseRunnableWidgetWrapped extends BaseRunnableWidget {
	render() {
		return (
			<BaseRunnableWidget>
				<div aslabel='input'>Input $a$</div>
				<div aslabel='maxIteration'>Recursion limit</div>
				<div aslabel='epsilon'>Subsequent value difference, the $\epsilon$</div>

				<div aslabel='iteration'>Iteration number</div>

				<div aslabel='finalDelta'>
					Final $\Delta$ . Difference between current output and previous iteration's output.
				</div>

				<div aslabel='output'>Converging output $L$</div>

				<div aslabel='converge'>Is it converging?</div>
			</BaseRunnableWidget>
		)
	}
}

export { BaseRunnableWidget, BaseRunnableWidgetWrapped }
