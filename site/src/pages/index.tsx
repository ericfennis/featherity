import { getAllData } from "../lib/icons";
import { Grid, Button, Flex, Text } from "@chakra-ui/core";
import copy from "copy-to-clipboard";
import download from "downloadjs";

const IndexPage = ({ data }) => {
  return (
    <div>
      <Grid templateColumns="repeat(5, 1fr)" gap={5}>
        {data.map((icon) => (
          <Button
            variant="ghost"
            borderWidth="1px"
            rounded="lg"
            padding={16}
            onClick={(event) => {
              if (event.shiftKey) {
                copy(icon.src);
              } else {
                download(icon.src, `${icon.name}.svg`, "image/svg+xml");
              }
            }}
          >
            <Flex direction="column" align="center" justify="center">
              <div dangerouslySetInnerHTML={{ __html: icon.src }} />
              <Text marginTop={5}>{icon.name}</Text>
            </Flex>
          </Button>
        ))}
      </Grid>
    </div>
  );
};

export async function getStaticProps() {
  let data = getAllData();
  return {
    props: {
      data,
    },
  };
}

export default IndexPage;
