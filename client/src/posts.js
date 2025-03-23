import { gql } from "@apollo/react-hooks";
import { useSubscription } from "@apollo/react-hooks";


const POST_CREATED = gql`
  subscription {
    postCreated {
      id
      title
      content
      userId
    }
  }
`;

const POST_UPDATED = gql`
  subscription {
    postUpdated {
      id
      title
      content
      userId
    }
  }
`;

const POST_DELETED = gql`
  subscription {
    postDeleted {
      id
      title
      content
      userId
    }
  }
`;

function Posts() {
    const { data, loading } = useSubscription(
        POST_CREATED,
        {
            onData: (data) => {
                console.log("posts received")
            }
        }
    )
    return "This is the post component";
}

export default Posts;