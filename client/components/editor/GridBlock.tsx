import * as React from 'react';

import css from './GridBlock.pcss';

interface IGridBlock {
	width: number;
	height: number;
	scale: number;
}

class GridBlock extends React.PureComponent<IGridBlock> {
	canvas?: HTMLCanvasElement;

	componentDidMount() {
		this.drawGrid();
	}

	componentDidUpdate() {
		this.drawGrid();
	}

	relCanvas = (rel: HTMLCanvasElement) => {
		this.canvas = rel;
	};

	drawGrid = () => {
		const {width, height, scale} = this.props;
		const size = 30;

		if (this.canvas) {
			const context = this.canvas.getContext('2d');

			if (context) {
				for (let x = 0.5; x < width; x += size * scale) {
					context.moveTo(x, 0);
					context.lineTo(x, height);
				}

				for (let y = 0.5; y < height; y += size * scale) {
					context.moveTo(0, y);
					context.lineTo(width, y);
				}

				context.strokeStyle = '#eee';
				context.stroke();
			}
		}
	};

	render() {
		const {width, height, scale} = this.props;

		return (
			<canvas
				ref={this.relCanvas}
				className={css.grid}
				width={String(width * scale)}
				height={String(height * scale)}
			/>
		);
	}
}

export default GridBlock;
