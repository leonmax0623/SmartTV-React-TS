import {MessageType} from 'client/components/slideshow/SlideshowPage';

export class Autoscroll {
	interval: NodeJS.Timer;
	timeout: NodeJS.Timer;
	config: {el?: any; s: number; sleepb: number} = {s: 2500, sleepb: -3};
	timer = this.config.sleepb;

	constructor(el: HTMLElement) {
		this.config.el = el;
	}

	handleMessages = (event: MessageEvent) => {
		const {data: messageCommand} = event;

		if (Object.values(MessageType).includes(messageCommand)) {
			switch (messageCommand) {
				case MessageType.SCROLL_FAST_FORWARD:
					this.manualScrollUp();

					break;

				case MessageType.SCROLL_REWIND:
					this.manualScrollDown();

					break;
			}
		}
	};

	start = () => {
		const startTimeout = 5000;

		this.config.el.scrollTop = 0;

		clearTimeout(this.timeout);
		clearInterval(this.interval);

		this.timeout = setTimeout(() => {
			this.interval = setInterval(this.scrollDown, this.config.s);
		}, startTimeout);

		document.addEventListener('message', this.handleMessages);
		window.addEventListener('message', this.handleMessages);
	};

	scrollDown = () => {
		const stock = 20;
		let scrollHeight = 0;
		// calculate the sum of all elements inside .el.el-twitter
		for (const elem of this.config.el.children) {
			scrollHeight += elem.offsetHeight; // height elem including padding, border, and margin
		}

		const scrollMax = scrollHeight - this.config.el.clientHeight - stock;

		if (this.config.el.scrollTop < scrollMax) {
			this.config.el.scrollTop += 50;

			return;
		}

		this.timer += 1;

		if (this.timer > 0) {
			this.config.el.scrollTop = 0;
			this.timer = this.config.sleepb;
		}
	};

	scrollUp = () => {
		if (this.config.el.scrollTop > 0) {
			this.config.el.scrollTop -= 50;
		}
	};

	manualScrollDown = () => {
		clearInterval(this.interval);

		this.scrollDown();

		this.interval = setInterval(this.scrollDown, this.config.s);
	};

	manualScrollUp = () => {
		clearInterval(this.interval);

		this.scrollUp();

		this.interval = setInterval(this.scrollDown, this.config.s);
	};

	remove = () => {
		this.config.el.scrollTop = 0;

		clearTimeout(this.timeout);
		clearInterval(this.interval);

		document.removeEventListener('message', this.handleMessages);
		window.removeEventListener('message', this.handleMessages);
	};
}
