import { fetchSanity, groq } from '@/lib/sanity/fetch'
import FilterList from '../BlogList/FilterList'
import PostPreviewLarge from '../PostPreviewLarge'
import Paginated from './Paginated'
import sortFeaturedPosts from './sortFeaturedPosts'
import { stegaClean } from '@sanity/client/stega'

export default async function BlogFrontpage({
	mainPost,
	showFeaturedPostsFirst,
}: Partial<{
	mainPost: 'recent' | 'featured'
	showFeaturedPostsFirst: boolean
}>) {
	const posts = await fetchSanity<Sanity.BlogPost[]>(
		groq`*[_type == 'blog.post']|order(publishDate desc){
				_type,
				_id,
				featured,
				metadata,
				categories[]->,
				publishDate,
			}
		`,
	)

	const [firstPost, ...otherPosts] =
		stegaClean(mainPost) === 'featured' ? sortFeaturedPosts(posts) : posts

	return (
		<section className="section space-y-12">
			<PostPreviewLarge post={firstPost} />
			<hr />
			<FilterList />
			<Paginated
				posts={sortFeaturedPosts(otherPosts, showFeaturedPostsFirst)}
			/>
		</section>
	)
}
