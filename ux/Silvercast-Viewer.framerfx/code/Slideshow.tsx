import * as React from "react"
import { Stack, Frame, addPropertyControls, ControlType } from "framer"
import { url } from "framer/resource";

import { ApolloClient } from "apollo-client"
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory"
import { createHttpLink } from "apollo-link-http"
import gql from "graphql-tag"

// Open Preview: Command + P
// Learn more: https://framer.com/api

export function Slideshow(props) {
    const { graphQlUrl, ...rest } = props

    const [state, setState] = React.useState({
        uploads: [],
        error: null,
        showQuote: false,
    })

    React.useEffect(() => {
        console.log("fetchDataFromGraphQlServer at " + graphQlUrl)
        const cache = new InMemoryCache()
        const link = createHttpLink({ uri: graphQlUrl })
    
        const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
            cache,
            link,
        })
    
        client
            .query({
                query: gql`
                 query {
                        uploads {
                            filename, id, path
                        }
                    }
              `,
            })
            .then(result => {
                console.log("GraphQL Query Result")
                console.log(result.data.uploads)
                setState({ uploads: result.data.uploads, ...props })
            })
            .catch(err => {
                console.log("error: " + err)
                setState({ error: err, ...props })
            })
    }, [props.graphQlUrl])

    let imageUri = url('./code/images/TeamInGoto.png');

    if (state.error == null) {
        return (
            <Stack size="100%" direction={props.stackDirection}>
                {// [4]
                    state.uploads.map(upload => (
                        <Frame
                            {...rest}
                            key={upload.id}
                            whileHover={{
                                scale: 1.1,
                            }}
                            style={{
                                color: "#fff",
                                fontSize: 16,
                                fontWeight: 600,
                            }}
                        >
                            {upload.path}
                            <img src={imageUri} alt="myImage" />
                        </Frame>
                    ))}
            </Stack>
        )
    }

    return (
        <Frame
            {...rest}
            style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: 600,
            }}
        >
            {state.error.message}
        </Frame>
    )
}

// Learn more: https://framer.com/api/property-controls/
addPropertyControls(Slideshow, {
    graphQlUrl: {
        title: "GraphQL",
        type: ControlType.String,
        defaultValue: "http://localhost:3001",
    },
})
