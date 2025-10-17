import { parseDate } from "https://esm.sh/chrono-node@2.9.0";
import parseDuration from "https://esm.sh/parse-duration@2.1.4";

const { Instant, Duration } = Temporal;

function instant(x) {
	// Parse human dates with chrono
	if (typeof x === 'string') {
		const date = parseDate(x);
		if (!date) {
			throw new Error(`Could not parse date: "${x}"`);
		}

		x = BigInt(date.getTime()) * 1000000n
	} else if (x.isUnit) {
		x = BigInt(x.to("ns").format({ notation: "fixed" }).slice(0, -2));
	}

	return new Instant(x);
}

const createInstant = math.factory('Instant', ['typed'], ({ typed }) => {
	typed.addType({
		name: 'Instant',
		test: (x) => x instanceof Instant
	})

	return instant
})

function duration(x) {
	// Parse human durations with parse-duration
	if (typeof x === 'string') {
		const milliseconds = parseDuration(x);
		if (milliseconds === null) {
			throw new Error(`Could not parse duration: "${x}"`);
		}

		x = { milliseconds }
	} else if (x.isUnit) {
		x = { milliseconds: x.toNumber("milliseconds") }
	}

	return Duration.from(x);
}

const createDuration = math.factory('Duration', ['typed'], ({ typed }) => {
	typed.addType({
		name: 'Duration',
		test: (x) => x instanceof Duration
	})

	return duration
})

Instant.prototype.format = function() {
	return this.toLocaleString()
}

Duration.prototype.format = function() {
	return this.round({ largestUnit: "years", relativeTo: Temporal.Now.plainDateTimeISO() }).toLocaleString()
}

const methods = {
	add: {
		'Instant, Duration': (a, b) => a.add(b),
		'Duration, Instant': (a, b) => b.add(a),
		'Duration, Duration': (a, b) => a.add(b),
	},
	subtract: {
		'Instant, Instant': (a, b) => a.since(b),
		'Instant, Duration': (a, b) => a.subtract(b),
		'Duration, Duration': (a, b) => a.subtract(b),
	},
	divide: {
		'Duration, BigNumber': (a, b) => Duration.from({ milliseconds: a.total({ unit: "milliseconds" }) / b }),
		'Duration, Duration': (a, b) => a.total({ unit: "milliseconds" }) / b.total({ unit: "milliseconds" }),
	},
	multiply: {
		'Duration, BigNumber': (a, b) => Duration.from({ milliseconds: a.total({ unit: "milliseconds" }) * b }),
		'BigNumber, Duration': (a, b) => Duration.from({ milliseconds: a * b.total({ unit: "milliseconds" }) }),
	},
	compare: {
		'Instant, Instant': (a, b) => Instant.compare(a, b),
		'Duration, Duration': (a, b) => Duration.compare(a, b),
	},
	larger: {
		'Instant, Instant': (a, b) => Instant.compare(a, b) > 0,
		'Duration, Duration': (a, b) => Duration.compare(a, b) > 0,
	},
	largerEq: {
		'Instant, Instant': (a, b) => Instant.compare(a, b) >= 0,
		'Duration, Duration': (a, b) => Duration.compare(a, b) >= 0,
	},
	smaller: {
		'Instant, Instant': (a, b) => Instant.compare(a, b) < 0,
		'Duration, Duration': (a, b) => Duration.compare(a, b) < 0,
	},
	smallerEq: {
		'Instant, Instant': (a, b) => Instant.compare(a, b) <= 0,
		'Duration, Duration': (a, b) => Duration.compare(a, b) <= 0,
	},
	equal: {
		'Instant, Instant': (a, b) => Instant.compare(a, b) === 0,
		'Duration, Duration': (a, b) => Duration.compare(a, b) === 0,
	},
	unequal: {
		'Instant, Instant': (a, b) => Instant.compare(a, b) !== 0,
		'Duration, Duration': (a, b) => Duration.compare(a, b) !== 0,
	},
	to: {
		'Duration, Unit': (a, unit) => math.unit(a.total({ unit: "milliseconds" }), "milliseconds").to(unit),
		'Instant, Unit': (a, unit) => math.unit(math.bignumber(a.epochNanoseconds), "nanoseconds").to(unit)
	}
}

for (const [methodName, signatures] of Object.entries(methods)) {
	const method = math.factory(methodName, ['typed', 'Instant', 'Duration'], ({ typed }) => {
		return typed(methodName, signatures)
	})
	math.import({ method })
}

// import the new data type and function
math.import({
	createInstant,
	createDuration,
	instant,
	duration,
	now: () => Temporal.Now.instant(),
})