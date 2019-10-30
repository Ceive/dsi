<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Tests;

use Ceive\Dsi\Builder\BuilderString;
use Ceive\Dsi\Member;
use Ceive\Dsi\Type\Scalar\TypeString;
use Ceive\Dsi\Type\TypeArray;
use Ceive\Dsi\Type\TypeObject;

class StructureTestCase extends \PHPUnit_Framework_TestCase{
	
	public $dsi_string;
	
	public function setUp(){
		
		$this->dsi_string = <<<DSI
		pattern         : string|null
		pattern_options : {}
		params          : {}
		strings
			-string[]
			-string
		
		reference
			-string
			-object
				module      : string
				controller  : string
				action      : string
				
		rules[]
			-object
				key         : string
				expected    : string
				mode        : string
			
		rules2[]
			key         : string
			expected    : string
			mode        : string
				
		options{}
		
		myStructure
			a: string
			b: string
		profile: User\Profile
		profiles: User\Profile[]
DSI;
	}
	
	public function testObject(){
		$b = new BuilderString();
		/** @var TypeObject $type */
		$type = $b->build($this->dsi_string);
		
		$this->assertInstanceOf(TypeObject::class, $type);
		
		$this->assertEquals(true,isset($type->members['pattern']));
		$this->assertInstanceOf(Member::class,$type->members['pattern']);
		
		
		
		$this->assertEquals(true                ,isset($type->members['profile']));
		$this->assertInstanceOf(Member::class       ,$type->members['profile']);
		$this->assertEquals(true                ,isset($type->members['profile']->types[0]));
		$this->assertEquals(1                   ,count($type->members['profile']->types[0]));
		$this->assertInstanceOf(TypeObject::class   ,$type->members['profile']->types[0]);
		$this->assertEquals('User\Profile'      ,$type->members['profile']->types[0]->classname);
	}
	
	public function dsi_v2(){
		//TODO dsi v2
		// TODO type request(modifier)
		// TODO class saturation
		// TODO Array builder
		//TODO Fix Rules[]
		$example = <<<DSI
		pattern         : string|null
		pattern_options : {}
		params          : {}
		
		reference
			-string#pattern(mca-reference)
			-object
				module      : string#pattern(&mca-reference)
				controller  : string#pattern(&mca-reference)
				action      : string#pattern(&mca-reference)
				
		rules[]
			-object
				key         : string#pattern(@\w+@)
				expected    : string
				mode        : string
				
				
		options{}
		
		myStructure
			a: string
			b: string
		profile: User\Profile
DSI;
		/**
		 * profile: User\Profile - TypeReference
		 */
		
		$this->dsi_member_short = 'string | int';
		$this->dsi_member_array = [
			'<string>',
			'<integer>',
			'<array>' => [
				'<object>' => [
					'module'        => 'string',
					'controller'    => 'string',
					'action'        => 'string',
				]
			],
		];
		$this->dsi_array = [
			
			'pattern'           => 'string|null',
			'pattern_options'   => '{}',
			'params'            => '{}',
			'reference'         => [
				'-string|null|integer',
				'-object'          => [
					'module'            => 'string',
					'controller'        => 'string',
					'action'            => 'string',
				]
			],
			'rules[]'           => [
				'-object'           => [
					'key'               => 'string',
					'expected'          => 'string',
					'mode'              => '&strict|&stabilized',
				]
			]
		
		];
		
		
		
	}
	
}


