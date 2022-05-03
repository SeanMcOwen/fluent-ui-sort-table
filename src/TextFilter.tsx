import React from "react"
import { TextField } from "@fluentui/react"
import { ITextFilterProps } from "./types"

export function TextFilter(props: ITextFilterProps) {
	return (
		<TextField
			label={props.label}
			value={props.value}
			onChange={(
				_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
				newValue?: string
			) => props.updateValue(newValue ?? "")}
		/>
	)
}
