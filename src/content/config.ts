import { defineCollection, type SchemaContext, z } from 'astro:content'
import { CATEGORIES } from '@/data/categories'
import { siteConfig } from '@/site-config'

// Create a reusable schema definition function
const createBlogSchema = ({ image }: SchemaContext) =>
	z.object({
		title: z.string().max(80),
		description: z.string().optional(),
		index: z.boolean().default(false),
		date: z.string().or(z.date()).optional(),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val))
			.optional(),
		heroImage: image().optional(),
		category: z
			.enum([CATEGORIES[0].slug, ...CATEGORIES.slice(1).map((c) => c.slug)])
			.or(z.string())
			.or(
				z.object({
					name: z.string(),
					index: z.number().optional(),
					depth: z.number().optional()
				})
			),
		tags: z.array(z.string()).default([]),
		comments: z.boolean().default(siteConfig.config.commentsEnabled),
		draft: z.boolean().default(false),
		post: z.boolean().default(true)
	})

// Use the reusable schema for both collections
const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: ({ image }) => {
		return createBlogSchema({ image })
	}
})

const blogs = defineCollection({
	// Type-check frontmatter using a schema
	schema: ({ image }) => {
		return createBlogSchema({ image })
	}
})

const physics = defineCollection({
	// Type-check frontmatter using a schema
	schema: ({ image }) => {
		return createBlogSchema({ image })
	}
})

const softDev = defineCollection({
	// Type-check frontmatter using a schema
	schema: ({ image }) => {
		return createBlogSchema({ image })
	}
})

export const collections = { blog, blogs, physics, 'soft-dev': softDev }
