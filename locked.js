import {
	create,
	factory,
	addDependencies,
	subtractDependencies,
	multiplyDependencies,
	divideDependencies,
	parserDependencies,
} from "https://esm.sh/mathjs@13.0.0";

function deepFlatten(nestedObject) {
	const flattenedObject = {};

	_deepFlatten(nestedObject, flattenedObject);

	return flattenedObject;
}

function hasOwnProperty(object, property) {
	return object && Object.hasOwnProperty.call(object, property);
}

// helper function used by deepFlatten
function _deepFlatten(nestedObject, flattenedObject) {
	for (const prop in nestedObject) {
		if (hasOwnProperty(nestedObject, prop)) {
			const value = nestedObject[prop];
			if (typeof value === "object" && value !== null) {
				_deepFlatten(value, flattenedObject);
			} else {
				flattenedObject[prop] = value;
			}
		}
	}
}

const dependencies = deepFlatten({
	addDependencies,
	subtractDependencies,
	multiplyDependencies,
	divideDependencies,
	parserDependencies,
});

const blocked = [
	"FunctionNode",
	"ObjectNode",
	"AssignmentNode",
	"ConditionalNode",
	"UnitClass"
]

dependencies.createMatrix = factory("matrix", [], () => {
	return () => {
		throw new Error("Locked");
	};
});

dependencies.createFraction = factory("fraction", [], () => {
	return () => {
		throw new Error("Locked");
	};
});

for (const name of blocked) {
	dependencies[`create${name}`] = factory(name, [], () => {
		return class Mock {
			constructor() {
				throw new Error("Locked");
			}
		};
	});
}

window.locked = new URL(location.href).searchParams.has("locked");
if (window.locked) window.math = create(dependencies);
