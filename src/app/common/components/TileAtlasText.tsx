import * as React from "react";
import { Box, Text } from "@stenajs-webui/core";

export interface TileAtlasTextProps {
  text: string;
}

export const TileAtlasText: React.FC<TileAtlasTextProps> = ({ text }) => {
  return (
    <Box
      justifyContent={"center"}
      alignItems={"center"}
      width={"32px"}
      height={"32px"}
    >
      <Text>{text}</Text>
    </Box>
  );
};
