package com.torryharris.BackEndSample.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.torryharris.BackEndSample.Entity.Tag;
import com.torryharris.BackEndSample.Service.Tag.TagService;

@RestController
@RequestMapping("/tag")
public class TagController {

    @Autowired
    private TagService tagService;

    @GetMapping
    public List<Tag> getAllTags() {
        return tagService.getAllTags();
    }

    @GetMapping("/{tagId}")
    public Tag getTagById(@PathVariable Integer tagId) {
        return tagService.getTagById(tagId);
    }

    @PostMapping
    public ResponseEntity<String> addTag(@RequestBody Tag tag) {
        tagService.addTag(tag);
        return new ResponseEntity<>("Tag Successfully added with ID: " + tag.getTagid(), HttpStatus.CREATED);
    }
    @PutMapping("/{tagId}")
    public ResponseEntity<String> updateTag(@PathVariable Integer tagId, @RequestBody Tag updatedTag) {
        tagService.updateTag(tagId, updatedTag);
        return new ResponseEntity<>("Tag Successfully updated with ID: " + tagId, HttpStatus.OK);
    }

    @DeleteMapping("/{tagId}")
    public ResponseEntity<String> deleteTag(@PathVariable Integer tagId) {
        tagService.deleteTagById(tagId);
        return new ResponseEntity<>("Tag Successfully deleted with ID: " + tagId, HttpStatus.OK);
    }
}
