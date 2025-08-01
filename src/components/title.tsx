import { ReactNode } from "react";
import { Text } from "react-native";

export function Title({ content, size }: {
    content: ReactNode,
    size: number
}) {
    return (
        <Text
            style={{
                fontWeight: "500",
                fontSize: size
            }}
        >
            {content}
        </Text>
    )
}
