import type { Accessor } from 'solid-js'

export type Fn<R = void> = () => R
/**
 * Infers the element type of an array
 */
export type ElementOf<T> = T extends (infer E)[] ? E : never
export type MaybeAccessor<T> = T | Accessor<T>

export const access = <T>(val: MaybeAccessor<T>): T =>
	typeof val === 'function' ? (val as Function)() : val

export const accessArray = <T>(value: MaybeAccessor<T[] | T>): T[] => {
	const _value = access(value)
	return Array.isArray(_value) ? _value : [_value]
}

export const withAccess = <T>(
	value: MaybeAccessor<T>,
	fn: (value: NonNullable<T>) => void,
) => {
	const _value = access(value)
	_value && fn(_value as NonNullable<T>)
}

export const promiseTimeout = (
	ms: number,
	throwOnTimeout = false,
	reason = 'Timeout',
): Promise<void> =>
	new Promise((resolve, reject) =>
		throwOnTimeout
			? setTimeout(() => reject(reason), ms)
			: setTimeout(resolve, ms),
	)
