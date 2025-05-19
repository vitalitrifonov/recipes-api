import { Link } from "react-router";
import IKImage from "./Image";
import { format } from "timeago.js";

// Üksiku postituse komponent
const PostListItem = ({ post }) => {
  return (
    <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 items-start mb-8">
      {/* Postituse pilt */}
      <div className="w-full xl:w-1/3">
        {post.img && (
          <div className="aspect-video">
            <IKImage
              src={post.img}
              className="rounded-2xl object-cover h-full"
              w="800"
            />
          </div>
        )}
      </div>
      {/* Pealkiri ja autor */}
      <div className="flex flex-col gap-2 w-full xl:w-1/2">
        {/* Postituse pealkiri koos lingiga postituse lehele */}
        <Link
          to={`/${post.slug}`}
          className="text-xl lg:text-3xl font-semibold hover:text-[#cc7e7c]"
        >
          {post.title}
        </Link>
        {/* Autor ja kuupäev */}
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span>Retsepti autor:</span>
          {/* Link konkreetse autori postitustele */}
          <Link to={`/posts?author=${post.user.username}`} className="text-[#cc7e7c] font-semibold hover:text-black transition-colors">
            {post.user.username}
          </Link>
          {/* Postituse loomise aeg */}
          <span>{post.createdAt && format(post.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default PostListItem;