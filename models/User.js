const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
	{
		first_name: {
			type: String,
			required: [true, 'First name is required.'],
			trim: true,
			text: true,
		},
		last_name: {
			type: String,
			required: [true, 'Last name is required.'],
			trim: true,
			text: true,
		},
		username: {
			type: String,
			required: [true, 'username is required.'],
			trim: true,
			text: true,
			unique: true,
		},
		email: {
			type: String,
			required: [true, 'Email is required.'],
			trim: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required.'],
		},
		picture: {
			type: String,
			default: 'https://res.cloudinary.com/dd51tnhyj/image/upload/v1673013193/avatar/default_pic_djiuth.png',
		},
		cover: {
			type: String,
			trim: true,
		},
		gender: {
			type: String,
			required: [true, 'Gender is required.'],
			trim: true,
		},
		bYear: {
			type: Number,
			required: true,
			trim: true,
		},
		bMonth: {
			type: Number,
			required: true,
			trim: true,
		},
		bDay: {
			type: Number,
			required: true,
			trim: true,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		friends: {
			type: Array,
			default: [],
		},
		following: {
			type: Array,
			default: [],
		},
		followers: {
			type: Array,
			default: [],
		},
		requests: {
			type: Array,
			default: [],
		},
		search: [
			{
				user: {
					type: ObjectId,
					ref: 'User',
				},
			},
		],
		details: {
			bio: {
				type: String,
			},
			otherName: {
				type: String,
			},
			job: {
				type: String,
			},
			workplace: {
				type: String,
			},
			highSchool: {
				type: String,
			},
			college: {
				type: String,
			},
			currentCity: {
				type: String,
			},
			hometown: {
				type: String,
			},
			relationship: {
				type: String,
				enum: ['Single', 'In a relationship', 'Married', 'Divorced'],
			},
			instagram: {
				type: String,
			},
			savedPosts: [
				{
					post: {
						type: ObjectId,
						ref: 'Post',
					},
					savedAt: {
						type: Date,
						default: new Date(),
					},
				},
			],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('User', userSchema);
